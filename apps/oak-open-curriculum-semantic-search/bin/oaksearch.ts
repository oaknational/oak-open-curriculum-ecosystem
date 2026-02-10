import { Command } from 'commander';

const program = new Command()
  .name('oaksearch')
  .description('Oak National Academy — curriculum semantic search CLI')
  .version('0.0.0-development');

// Command groups will be registered during SDK extraction (Checkpoint E).
// See: .agent/plans/semantic-search/active/search-sdk-cli.plan.md
//
// Planned structure:
//   oaksearch search   — query lessons, units, sequences, suggestions
//   oaksearch admin    — ES setup, ingest, index management
//   oaksearch eval     — benchmarks, ground truth validation
//   oaksearch observe  — zero-hit telemetry

program.parse();
