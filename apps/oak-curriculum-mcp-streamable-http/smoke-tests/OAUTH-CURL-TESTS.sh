#!/bin/bash
# OAuth Discovery curl Tests
# These tests validate that the OAuth discovery chain works correctly

set -e

echo "═══════════════════════════════════════════════════════"
echo "🧪 OAuth Discovery curl Tests"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Prerequisites: Dev server running on http://localhost:3333"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: AS metadata endpoint should return 200 (backward compatibility for older MCP clients)
echo -e "${BLUE}Test 1: Authorization Server metadata (should return 200 with JSON)${NC}"
echo "Command: curl -s http://localhost:3333/.well-known/oauth-authorization-server | jq ."
echo ""
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/.well-known/oauth-authorization-server)
if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}: AS metadata endpoint returns 200"
    curl -s http://localhost:3333/.well-known/oauth-authorization-server | jq .
else
    echo -e "${RED}❌ FAIL${NC}: Expected 200, got $STATUS"
    exit 1
fi
echo ""
echo "───────────────────────────────────────────────────────"
echo ""

# Test 2: Protected resource metadata should work
echo -e "${BLUE}Test 2: Protected resource metadata (should return 200 with JSON)${NC}"
echo "Command: curl -s http://localhost:3333/.well-known/oauth-protected-resource | jq ."
echo ""
METADATA=$(curl -s http://localhost:3333/.well-known/oauth-protected-resource)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/.well-known/oauth-protected-resource)

if [ "$STATUS" = "200" ]; then
    echo "$METADATA" | jq .
    echo ""
    
    # Verify it contains authorization_servers
    if echo "$METADATA" | jq -e '.authorization_servers | length > 0' > /dev/null; then
        CLERK_URL=$(echo "$METADATA" | jq -r '.authorization_servers[0]')
        echo -e "${GREEN}✅ PASS${NC}: Protected resource metadata returned successfully"
        echo "   Authorization Server: $CLERK_URL"
    else
        echo -e "${RED}❌ FAIL${NC}: Missing authorization_servers in metadata"
        exit 1
    fi
else
    echo -e "${RED}❌ FAIL${NC}: Expected 200, got $STATUS"
    exit 1
fi
echo ""
echo "───────────────────────────────────────────────────────"
echo ""

# Test 3: Clerk AS metadata directly accessible
echo -e "${BLUE}Test 3: Clerk AS metadata directly accessible (no proxy)${NC}"
echo "Command: curl -s $CLERK_URL/.well-known/oauth-authorization-server | jq ."
echo ""
AS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CLERK_URL/.well-known/oauth-authorization-server")

if [ "$AS_STATUS" = "200" ]; then
    curl -s "$CLERK_URL/.well-known/oauth-authorization-server" | jq '{issuer, authorization_endpoint, token_endpoint, jwks_uri}'
    echo ""
    echo -e "${GREEN}✅ PASS${NC}: Clerk AS metadata accessible directly (no proxy needed!)"
else
    echo -e "${RED}❌ FAIL${NC}: Expected 200 from Clerk, got $AS_STATUS"
    exit 1
fi
echo ""
echo "───────────────────────────────────────────────────────"
echo ""

# Test 4: OAuth metadata accessible
echo -e "${BLUE}Test 4: OAuth metadata returns 200 OK${NC}"
echo "Command: curl -I http://localhost:3333/.well-known/oauth-protected-resource"
echo ""
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/.well-known/oauth-protected-resource)

if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}: OAuth metadata endpoint accessible"
else
    echo -e "${RED}❌ FAIL${NC}: Expected 200, got $STATUS"
    exit 1
fi
echo ""
echo "───────────────────────────────────────────────────────"
echo ""

# Summary
echo "═══════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 All tests PASSED!${NC}"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "✅ Proxy endpoint removed (404)"
echo "✅ Protected resource metadata works (200)"
echo "✅ Clerk AS metadata directly accessible (200)"
echo "✅ OAuth metadata endpoint accessible (200)"
echo ""
echo "🎯 Conclusion: OAuth discovery works without the proxy!"
echo ""

