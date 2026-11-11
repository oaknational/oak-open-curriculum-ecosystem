import { describe, expect, it } from 'vitest';
import {
  publishCurrentSourceArtifacts,
  type ArtifactPublicationFileSystem,
} from './publish-artifacts.js';

function failingSecondReplacement(): {
  readonly contents: Map<string, string>;
  readonly fileSystem: ArtifactPublicationFileSystem;
} {
  const contents = new Map([
    ['anchors.json', 'old anchors'],
    ['truth.json', 'old truth'],
  ]);
  let stageCount = 0;
  let replacementCount = 0;
  const fileSystem: ArtifactPublicationFileSystem = {
    readText: async (filePath) => contents.get(filePath) ?? null,
    stageText: async (filePath, content) => {
      const stagedPath = `${filePath}.stage-${String(++stageCount)}`;
      contents.set(stagedPath, content);
      return stagedPath;
    },
    replace: async (stagedPath, targetPath) => {
      replacementCount += 1;
      if (replacementCount === 2) {
        throw new Error('injected second publication failure');
      }
      contents.set(targetPath, contents.get(stagedPath) ?? '');
      contents.delete(stagedPath);
    },
    remove: async (filePath) => {
      contents.delete(filePath);
      return;
    },
  };
  return { contents, fileSystem };
}

describe('publishCurrentSourceArtifacts', () => {
  it('rolls the first artifact back when the second publication fails', async () => {
    const { contents, fileSystem } = failingSecondReplacement();

    await expect(
      publishCurrentSourceArtifacts(
        [
          { path: 'anchors.json', content: 'new anchors' },
          { path: 'truth.json', content: 'new truth' },
        ],
        fileSystem,
      ),
    ).rejects.toThrow('injected second publication failure');

    expect(contents.get('anchors.json')).toBe('old anchors');
    expect(contents.get('truth.json')).toBe('old truth');
    expect([...contents.keys()].filter((key) => key.includes('.stage-'))).toEqual([]);
  });

  it('publishes a missing artifact and removes it again when a later publication fails', async () => {
    const { contents, fileSystem } = failingSecondReplacement();
    contents.delete('anchors.json');

    await expect(
      publishCurrentSourceArtifacts(
        [
          { path: 'anchors.json', content: 'new anchors' },
          { path: 'truth.json', content: 'new truth' },
        ],
        fileSystem,
      ),
    ).rejects.toThrow('injected second publication failure');

    expect(contents.has('anchors.json')).toBe(false);
    expect(contents.get('truth.json')).toBe('old truth');
    expect([...contents.keys()].filter((key) => key.includes('.stage-'))).toEqual([]);
  });
});
