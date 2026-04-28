import { digestSeed, readUInt32BigEndian } from '../../src/core/agent-identity/hash';

describe('agent identity hash helpers', () => {
  it('reads digest slices as unsigned 32-bit big-endian integers', () => {
    const bytes = [0x12, 0x34, 0x56, 0x78, 0xfe, 0xdc, 0xba, 0x98];

    expect(readUInt32BigEndian(bytes, 0)).toBe(0x12345678);
    expect(readUInt32BigEndian(bytes, 4)).toBe(0xfedcba98);
  });

  it('hashes the seed with SHA-256', () => {
    expect(digestSeed('example-session-id-001').hex).toBe(
      '185418b63b4e9155630ddbe1867dcc1369e90faab7cc722e38f8c5590c263c6c',
    );
  });
});
