/**
 * The gate children and group cleanup the gate-slot smokes use: argument
 * lists for a fixture's `run`, each standing for a gate whose behaviour a
 * proof needs, and a quiet SIGKILL for a group a proof left running.
 */

/** A gate child that prints `ready <pid>` and ends with `code` when its stdin closes. */
export function blockedChild(code: number): readonly string[] {
  const ready = String.raw`process.stdout.write('ready ' + process.pid + '\n');`;
  const block = `process.stdin.resume(); process.stdin.on('end', () => process.exit(${code}));`;
  return ['run', 'pnpm', '-e', `${ready} ${block}`];
}

/**
 * A gate child, for the `sh` fixture, that leaves a dead member in its group
 * which no SIGKILL clears: a parent forks the member, moves itself to a group
 * of its own, and reads its stdin to the end without reaping it. The leader
 * exits 0 once the parent has moved; closing the fixture's stdin ends the
 * parent, and the member is reaped with it.
 */
export function unreapedMemberChild(): readonly string[] {
  const perl = [
    'pipe(my $r, my $w) or die "pipe: $!";',
    'defined(my $p = fork()) or die "fork: $!";',
    'if ($p == 0) {',
    'close $r; open STDOUT, ">", "/dev/null"; open STDERR, ">", "/dev/null";',
    'defined(my $c = fork()) or die "fork: $!"; if ($c == 0) { exit 0 }',
    String.raw`setpgrp(0, 0) or die "setpgrp: $!"; print $w "moved\n"; close $w;`,
    '1 while <STDIN>; exit 0;',
    '}',
    'close $w; defined(<$r>) or die "the parent never moved"; exit 0;',
  ].join(' ');
  return ['run', 'pnpm', '-c', `exec /usr/bin/perl -e '${perl}'`];
}

/** SIGKILL the group `leader` leads, if it is still there. */
export function killGroup(leader: number): void {
  try {
    process.kill(-leader, 'SIGKILL');
  } catch {
    // Already gone.
  }
}
