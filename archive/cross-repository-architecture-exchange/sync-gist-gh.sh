#!/bin/bash

# Script to sync RFC document with GitHub Gist using gh CLI
# Gist URL: https://gist.github.com/<gist_owner>/<gist_id>
# This script uses gh gist commands with diff and merge handling

set -e  # Exit on error

# Disable interactive prompts for gh CLI when running in scripts
export GH_PROMPT_DISABLED=true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source configuration
CONFIG_FILE="${SCRIPT_DIR}/config.env"
if [ ! -f "${CONFIG_FILE}" ]; then
    echo "Error: Configuration file not found: ${CONFIG_FILE}"
    echo "Please create config.env with GIST_ID and LOCAL_FILE variables"
    exit 1
fi
source "${CONFIG_FILE}"

# Validate required variables
if [ -z "${GIST_ID}" ] || [ -z "${LOCAL_FILE}" ]; then
    echo "Error: Required variables GIST_ID and LOCAL_FILE must be set in config.env"
    exit 1
fi

LOCAL_PATH="${SCRIPT_DIR}/${LOCAL_FILE}"
TEMP_DIR="${SCRIPT_DIR}/.sync-temp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

function print_usage() {
    echo "Usage: $0 {fetch|push|sync|diff|status|help}"
    echo ""
    echo "Commands:"
    echo "  fetch    Download the latest version from the gist (with backup)"
    echo "  push     Upload local changes to the gist (checks for conflicts first)"
    echo "  sync     Two-way sync: fetch with merge, then push"
    echo "  diff     Show differences between local and remote versions"
    echo "  status   Show the sync status"
    echo "  help     Show this help message"
    echo ""
    echo "Gist ID: ${GIST_ID}"
    echo "Local file: ${LOCAL_FILE}"
}

function ensure_temp_dir() {
    if [ ! -d "${TEMP_DIR}" ]; then
        mkdir -p "${TEMP_DIR}"
    fi
}

function fetch_remote() {
    # Fetch remote version to temp file
    local TEMP_REMOTE="${TEMP_DIR}/remote.md"
    
    echo -e "${YELLOW}Fetching remote version...${NC}" >&2
    # Use --raw flag to get raw content and --filename to get specific file
    if gh gist view "${GIST_ID}" --raw --filename "${LOCAL_FILE}" > "${TEMP_REMOTE}" 2>/dev/null; then
        echo -e "${GREEN}✓ Remote version fetched${NC}" >&2
        echo "${TEMP_REMOTE}"
    else
        echo -e "${RED}✗ Failed to fetch remote version${NC}" >&2
        return 1
    fi
}

function fetch_all_files() {
    # Fetch all three files from the gist
    echo -e "${YELLOW}Fetching all files from gist...${NC}"
    
    ensure_temp_dir
    
    local SUCCESS=true
    
    # Fetch RFC document
    echo -e "${BLUE}Fetching RFC document...${NC}"
    if gh gist view "${GIST_ID}" --raw --filename "${LOCAL_FILE}" > "${LOCAL_PATH}" 2>/dev/null; then
        echo -e "${GREEN}✓ RFC document fetched${NC}"
    else
        echo -e "${RED}✗ Failed to fetch RFC document${NC}"
        SUCCESS=false
    fi
    
    # Fetch config.env.example
    echo -e "${BLUE}Fetching config.env.example...${NC}"
    if gh gist view "${GIST_ID}" --raw --filename "config.env.example" > "${SCRIPT_DIR}/config.env.example" 2>/dev/null; then
        echo -e "${GREEN}✓ config.env.example fetched${NC}"
    else
        echo -e "${YELLOW}⚠ Could not fetch config.env.example${NC}"
    fi
    
    # Fetch sync script
    echo -e "${BLUE}Fetching sync-gist-gh.sh...${NC}"
    if gh gist view "${GIST_ID}" --raw --filename "sync-gist-gh.sh" > "${SCRIPT_DIR}/sync-gist-gh.sh.new" 2>/dev/null; then
        echo -e "${GREEN}✓ sync-gist-gh.sh fetched${NC}"
        # Check if script has changed
        if ! diff -q "$0" "${SCRIPT_DIR}/sync-gist-gh.sh.new" > /dev/null 2>&1; then
            echo -e "${YELLOW}⚠ Sync script has updates. New version saved as sync-gist-gh.sh.new${NC}"
            echo "  To update the script: mv sync-gist-gh.sh.new sync-gist-gh.sh"
        else
            rm "${SCRIPT_DIR}/sync-gist-gh.sh.new"
            echo "  Script is up to date"
        fi
    else
        echo -e "${YELLOW}⚠ Could not fetch sync script${NC}"
    fi
    
    if [ "$SUCCESS" = true ]; then
        return 0
    else
        return 1
    fi
}

function show_diff() {
    ensure_temp_dir
    
    # Check if local file exists
    if [ ! -f "${LOCAL_PATH}" ]; then
        echo -e "${YELLOW}Local file does not exist yet${NC}"
        echo "Run 'fetch' to create it from the gist"
        return 0
    fi
    
    # Fetch remote version
    TEMP_REMOTE=$(fetch_remote)
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    echo ""
    echo -e "${BLUE}Comparing local and remote versions...${NC}"
    echo "================================================"
    
    # Use diff with colors if available
    if command -v colordiff &> /dev/null; then
        colordiff -u "${LOCAL_PATH}" "${TEMP_REMOTE}" || true
    elif command -v diff &> /dev/null; then
        diff -u "${LOCAL_PATH}" "${TEMP_REMOTE}" || true
    else
        echo -e "${RED}No diff command available${NC}"
        return 1
    fi
    
    echo "================================================"
    echo ""
    
    # Show summary
    LOCAL_LINES=$(wc -l < "${LOCAL_PATH}" | tr -d ' ')
    REMOTE_LINES=$(wc -l < "${TEMP_REMOTE}" | tr -d ' ')
    
    echo "Summary:"
    echo "  Local:  ${LOCAL_LINES} lines"
    echo "  Remote: ${REMOTE_LINES} lines"
    
    if diff -q "${LOCAL_PATH}" "${TEMP_REMOTE}" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Files are identical${NC}"
    else
        echo -e "${YELLOW}⚠ Files differ${NC}"
    fi
}

function fetch_gist() {
    echo -e "${YELLOW}Fetching latest version from gist...${NC}"
    
    ensure_temp_dir
    
    # Create backup of local file if it exists
    if [ -f "${LOCAL_PATH}" ]; then
        BACKUP_PATH="${LOCAL_PATH}.backup-$(date +%Y%m%d-%H%M%S)"
        cp "${LOCAL_PATH}" "${BACKUP_PATH}"
        echo "Created backup: ${BACKUP_PATH}"
    fi
    
    # Fetch remote version
    TEMP_REMOTE=$(fetch_remote)
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # If local file doesn't exist, just copy remote
    if [ ! -f "${LOCAL_PATH}" ]; then
        cp "${TEMP_REMOTE}" "${LOCAL_PATH}"
        echo -e "${GREEN}✓ Created local file from remote${NC}"
        echo "Saved to: ${LOCAL_PATH}"
        return 0
    fi
    
    # Check if files are different
    if diff -q "${LOCAL_PATH}" "${TEMP_REMOTE}" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Local file is already up to date${NC}"
        return 0
    fi
    
    # Files differ - attempt three-way merge using git's merge-file
    echo -e "${YELLOW}Differences detected. Attempting to merge...${NC}"
    
    # Create a base version (use the backup as base if it exists from a previous fetch)
    BASE_PATH="${TEMP_DIR}/base.md"
    if [ -f "${LOCAL_PATH}.backup" ]; then
        cp "${LOCAL_PATH}.backup" "${BASE_PATH}"
    else
        # If no previous backup, use remote as base (conservative approach)
        cp "${TEMP_REMOTE}" "${BASE_PATH}"
    fi
    
    # Attempt merge using git merge-file
    MERGED_PATH="${TEMP_DIR}/merged.md"
    cp "${LOCAL_PATH}" "${MERGED_PATH}"
    
    if command -v git &> /dev/null; then
        # Use git merge-file for three-way merge
        # Returns 0 on clean merge, >0 if conflicts
        git merge-file -p "${MERGED_PATH}" "${BASE_PATH}" "${TEMP_REMOTE}" > "${TEMP_DIR}/merge-result.md" 2>/dev/null
        MERGE_STATUS=$?
        
        if [ $MERGE_STATUS -eq 0 ]; then
            # Clean merge
            cp "${TEMP_DIR}/merge-result.md" "${LOCAL_PATH}"
            echo -e "${GREEN}✓ Successfully merged local and remote changes${NC}"
            echo "Merged file saved to: ${LOCAL_PATH}"
        else
            # Merge conflicts
            echo -e "${YELLOW}⚠ Merge conflicts detected${NC}"
            echo ""
            echo "Conflict markers have been added to the file."
            echo "Please resolve conflicts manually in: ${LOCAL_PATH}"
            echo ""
            echo "Conflicts are marked with:"
            echo "  <<<<<<< (your local changes)"
            echo "  ======="
            echo "  >>>>>>> (remote changes)"
            
            cp "${TEMP_DIR}/merge-result.md" "${LOCAL_PATH}"
            
            # Show conflict locations
            echo ""
            echo "Conflict locations:"
            grep -n "^<<<<<<< " "${LOCAL_PATH}" | head -5
            
            return 1
        fi
    else
        # Fallback: no git available, prompt user
        echo -e "${YELLOW}Git not available for merging${NC}"
        echo "Choose an option:"
        echo "  1) Keep local version"
        echo "  2) Use remote version"
        echo "  3) Cancel"
        
        read -p "Enter choice (1-3): " choice
        
        case $choice in
            1)
                echo -e "${BLUE}Keeping local version${NC}"
                ;;
            2)
                cp "${TEMP_REMOTE}" "${LOCAL_PATH}"
                echo -e "${GREEN}✓ Updated to remote version${NC}"
                ;;
            *)
                echo -e "${YELLOW}Cancelled${NC}"
                return 1
                ;;
        esac
    fi
    
    # Show first few lines to confirm
    echo ""
    echo "Document header:"
    head -n 7 "${LOCAL_PATH}"
    
    # Now fetch the other files
    echo ""
    echo -e "${BLUE}Fetching additional files...${NC}"
    
    # Fetch config.env.example
    if gh gist view "${GIST_ID}" --raw --filename "config.env.example" > "${SCRIPT_DIR}/config.env.example" 2>/dev/null; then
        echo -e "${GREEN}✓ config.env.example fetched${NC}"
    fi
    
    # Fetch sync script updates
    if gh gist view "${GIST_ID}" --raw --filename "sync-gist-gh.sh" > "${SCRIPT_DIR}/sync-gist-gh.sh.new" 2>/dev/null; then
        if ! diff -q "$0" "${SCRIPT_DIR}/sync-gist-gh.sh.new" > /dev/null 2>&1; then
            echo -e "${YELLOW}⚠ Sync script has updates. New version saved as sync-gist-gh.sh.new${NC}"
            echo "  To update: mv sync-gist-gh.sh.new sync-gist-gh.sh"
        else
            rm "${SCRIPT_DIR}/sync-gist-gh.sh.new"
            echo -e "${GREEN}✓ sync-gist-gh.sh is up to date${NC}"
        fi
    fi
    
    # Fetch .gitignore
    if gh gist view "${GIST_ID}" --raw --filename ".gitignore" > "${SCRIPT_DIR}/.gitignore" 2>/dev/null; then
        echo -e "${GREEN}✓ .gitignore fetched${NC}"
    fi
}

function push_all_files() {
    # Push all three files to the gist
    echo -e "${YELLOW}Pushing all files to gist...${NC}"
    
    # Check if local RFC file exists
    if [ ! -f "${LOCAL_PATH}" ]; then
        echo -e "${RED}✗ Local RFC file not found: ${LOCAL_FILE}${NC}"
        return 1
    fi
    
    local SUCCESS=true
    
    # Update the main RFC document
    echo -e "${BLUE}Pushing RFC document...${NC}"
    if gh gist edit "${GIST_ID}" --filename "${LOCAL_FILE}" "${LOCAL_PATH}" 2>/dev/null; then
        echo -e "${GREEN}✓ RFC document pushed${NC}"
    else
        echo -e "${RED}✗ Failed to push RFC document${NC}"
        SUCCESS=false
    fi
    
    # Push config.env.example (not config.env!)
    if [ -f "${SCRIPT_DIR}/config.env.example" ]; then
        echo -e "${BLUE}Pushing config.env.example...${NC}"
        if gh gist edit "${GIST_ID}" -a "config.env.example" < "${SCRIPT_DIR}/config.env.example" 2>/dev/null; then
            echo -e "${GREEN}✓ config.env.example pushed${NC}"
        else
            echo -e "${YELLOW}⚠ Could not push config.env.example${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ config.env.example not found locally${NC}"
    fi
    
    # Push the sync script itself
    echo -e "${BLUE}Pushing sync-gist-gh.sh...${NC}"
    if gh gist edit "${GIST_ID}" -a "sync-gist-gh.sh" < "$0" 2>/dev/null; then
        echo -e "${GREEN}✓ sync-gist-gh.sh pushed${NC}"
    else
        echo -e "${YELLOW}⚠ Could not push sync script${NC}"
    fi
    
    # Push .gitignore file
    if [ -f "${SCRIPT_DIR}/.gitignore" ]; then
        echo -e "${BLUE}Pushing .gitignore...${NC}"
        if gh gist edit "${GIST_ID}" -a ".gitignore" < "${SCRIPT_DIR}/.gitignore" 2>/dev/null; then
            echo -e "${GREEN}✓ .gitignore pushed${NC}"
        else
            echo -e "${YELLOW}⚠ Could not push .gitignore${NC}"
        fi
    fi
    
    if [ "$SUCCESS" = true ]; then
        echo -e "${GREEN}✓ All critical files pushed successfully${NC}"
        return 0
    else
        return 1
    fi
}

function push_gist() {
    echo -e "${YELLOW}Pushing local changes to gist...${NC}"
    
    # Check if local file exists
    if [ ! -f "${LOCAL_PATH}" ]; then
        echo -e "${RED}✗ Local file not found: ${LOCAL_FILE}${NC}"
        exit 1
    fi
    
    ensure_temp_dir
    
    # First check if there are remote changes we don't have
    echo -e "${BLUE}Checking for remote changes...${NC}"
    TEMP_REMOTE=$(fetch_remote)
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    # Compare with remote
    if ! diff -q "${LOCAL_PATH}" "${TEMP_REMOTE}" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Remote has different content${NC}"
        echo ""
        echo "Showing differences:"
        echo "-------------------"
        
        # Show brief diff
        if command -v diff &> /dev/null; then
            diff -u "${TEMP_REMOTE}" "${LOCAL_PATH}" | head -20
            echo "..."
        fi
        
        echo ""
        echo -e "${CYAN}Do you want to:${NC}"
        echo "  1) Force push (overwrite remote)"
        echo "  2) Fetch and merge first (recommended)"
        echo "  3) Cancel"
        
        read -p "Enter choice (1-3): " choice
        
        case $choice in
            1)
                echo -e "${YELLOW}Force pushing...${NC}"
                ;;
            2)
                echo -e "${BLUE}Fetching and merging first...${NC}"
                fetch_gist
                if [ $? -ne 0 ]; then
                    echo -e "${RED}Merge failed. Please resolve conflicts and try again${NC}"
                    return 1
                fi
                echo ""
                echo -e "${BLUE}Now pushing merged changes...${NC}"
                ;;
            *)
                echo -e "${YELLOW}Push cancelled${NC}"
                return 1
                ;;
        esac
    else
        echo -e "${GREEN}✓ No remote changes detected${NC}"
    fi
    
    # Push all files using the new function
    push_all_files
    
    echo -e "${GREEN}✓ Successfully pushed changes to gist${NC}"
    echo "Gist URL: https://gist.github.com/${GIST_OWNER:-<gist_owner>}/${GIST_ID}"
    
    # Save current version as base for future merges
    cp "${LOCAL_PATH}" "${TEMP_DIR}/base.md"
    
    # Show what was pushed
    echo ""
    echo "Pushed document header:"
    head -n 7 "${LOCAL_PATH}"
}

function sync_gist() {
    echo -e "${BLUE}Starting two-way sync...${NC}"
    echo ""
    
    # First fetch to get latest remote changes
    fetch_gist
    FETCH_STATUS=$?
    
    if [ $FETCH_STATUS -ne 0 ]; then
        echo -e "${YELLOW}⚠ Fetch completed with conflicts${NC}"
        echo "Please resolve conflicts before pushing"
        return 1
    fi
    
    echo ""
    echo -e "${BLUE}Now pushing local changes...${NC}"
    
    # Then push local changes
    push_gist
    
    echo ""
    echo -e "${GREEN}✓ Sync complete${NC}"
}

function show_status() {
    echo -e "${BLUE}Sync Status${NC}"
    echo "============"
    echo ""
    
    # Check local file
    if [ -f "${LOCAL_PATH}" ]; then
        echo -e "${GREEN}✓ Local file exists${NC}"
        echo "  Path: ${LOCAL_PATH}"
        echo "  Modified: $(date -r "${LOCAL_PATH}" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "Unknown")"
        echo "  Size: $(wc -c < "${LOCAL_PATH}" | tr -d ' ') bytes"
        echo "  Lines: $(wc -l < "${LOCAL_PATH}" | tr -d ' ')"
        
        # Check for conflict markers
        if grep -q "^<<<<<<< " "${LOCAL_PATH}" 2>/dev/null; then
            echo -e "${RED}  ⚠ Contains unresolved merge conflicts!${NC}"
        fi
    else
        echo -e "${RED}✗ Local file not found${NC}"
    fi
    
    echo ""
    
    # Check remote
    echo -e "${YELLOW}Checking remote gist...${NC}"
    ensure_temp_dir
    TEMP_REMOTE="${TEMP_DIR}/status-check.md"
    
    # Get gist metadata including last updated time
    GIST_META=$(gh api "gists/${GIST_ID}" 2>/dev/null)
    if [ $? -eq 0 ]; then
        # Extract updated_at timestamp
        REMOTE_UPDATED=$(echo "${GIST_META}" | grep -o '"updated_at":"[^"]*"' | head -1 | cut -d'"' -f4)
        
        # Convert to readable format if date command is available
        if [ -n "${REMOTE_UPDATED}" ] && command -v date &> /dev/null; then
            # Try to parse ISO 8601 format
            if date --version &> /dev/null 2>&1; then
                # GNU date
                REMOTE_UPDATED_READABLE=$(date -d "${REMOTE_UPDATED}" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "${REMOTE_UPDATED}")
            else
                # BSD date (macOS)
                REMOTE_UPDATED_READABLE=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "${REMOTE_UPDATED}" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "${REMOTE_UPDATED}")
            fi
        else
            REMOTE_UPDATED_READABLE="${REMOTE_UPDATED}"
        fi
    fi
    
    if gh gist view "${GIST_ID}" --raw --filename "${LOCAL_FILE}" > "${TEMP_REMOTE}" 2>/dev/null; then
        echo -e "${GREEN}✓ Remote gist accessible${NC}"
        if [ -n "${REMOTE_UPDATED_READABLE}" ]; then
            echo "  Modified: ${REMOTE_UPDATED_READABLE}"
        fi
        echo "  Size: $(wc -c < "${TEMP_REMOTE}" | tr -d ' ') bytes"
        echo "  Lines: $(wc -l < "${TEMP_REMOTE}" | tr -d ' ')"
        
        # Compare with local
        if [ -f "${LOCAL_PATH}" ]; then
            if diff -q "${LOCAL_PATH}" "${TEMP_REMOTE}" > /dev/null 2>&1; then
                echo -e "${GREEN}  ✓ In sync with remote${NC}"
            else
                echo -e "${YELLOW}  ⚠ Not in sync with remote${NC}"
                
                # Compare timestamps if both are available
                if [ -n "${REMOTE_UPDATED}" ]; then
                    LOCAL_TIMESTAMP=$(stat -f "%Sm" -t "%Y-%m-%dT%H:%M:%SZ" "${LOCAL_PATH}" 2>/dev/null || stat -c "%y" "${LOCAL_PATH}" 2>/dev/null | cut -d' ' -f1-2)
                    
                    # Try to determine which is newer
                    if [ -n "${LOCAL_TIMESTAMP}" ]; then
                        # Convert both to epoch for comparison
                        if date --version &> /dev/null 2>&1; then
                            # GNU date
                            LOCAL_EPOCH=$(date -d "${LOCAL_TIMESTAMP}" +%s 2>/dev/null || echo "0")
                            REMOTE_EPOCH=$(date -d "${REMOTE_UPDATED}" +%s 2>/dev/null || echo "0")
                        else
                            # BSD date (macOS)
                            LOCAL_EPOCH=$(date -j -f "%Y-%m-%d %H:%M:%S" "${LOCAL_TIMESTAMP}" +%s 2>/dev/null || echo "0")
                            REMOTE_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "${REMOTE_UPDATED}" +%s 2>/dev/null || echo "0")
                        fi
                        
                        if [ "${LOCAL_EPOCH}" -gt "${REMOTE_EPOCH}" ]; then
                            echo -e "${BLUE}  → Local is newer${NC}"
                        elif [ "${REMOTE_EPOCH}" -gt "${LOCAL_EPOCH}" ]; then
                            echo -e "${YELLOW}  → Remote is newer${NC}"
                        fi
                    fi
                fi
                
                echo "  Run 'diff' to see changes or 'sync' to synchronize"
            fi
        fi
    else
        echo -e "${RED}✗ Cannot access remote gist${NC}"
        echo "  Check your gh authentication: gh auth status"
    fi
    
    echo ""
    echo "Gist URL: https://gist.github.com/${GIST_OWNER:-<gist_owner>}/${GIST_ID}"
    
    # Check gh CLI auth
    echo ""
    echo -e "${BLUE}GitHub CLI Status:${NC}"
    if command -v gh &> /dev/null; then
        echo -e "${GREEN}✓ gh CLI installed${NC}"
        
        # Check auth status
        if gh auth status &> /dev/null; then
            echo -e "${GREEN}✓ Authenticated${NC}"
        else
            echo -e "${RED}✗ Not authenticated${NC}"
            echo "  Run: gh auth login"
        fi
    else
        echo -e "${RED}✗ gh CLI not installed${NC}"
        echo "  Install from: https://cli.github.com/"
    fi
}

# Main script logic
case "$1" in
    fetch)
        fetch_gist
        ;;
    push)
        push_gist
        ;;
    sync)
        sync_gist
        ;;
    diff)
        show_diff
        ;;
    status)
        show_status
        ;;
    help)
        print_usage
        ;;
    *)
        if [ -z "$1" ]; then
            print_usage
        else
            echo -e "${RED}Invalid command: $1${NC}"
            echo ""
            print_usage
        fi
        exit 1
        ;;
esac
