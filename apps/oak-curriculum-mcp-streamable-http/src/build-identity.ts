import { err, ok, type Result } from '@oaknational/result';
import type {
  AppBuildIdentity,
  BuildIdentityBranch,
  BuildIdentityContext,
  ReleaseEnvironment,
} from '@oaknational/build-metadata';

/**
 * Error returned when app build identity generation has not populated runtime data.
 */
interface AppBuildIdentityError {
  readonly kind: 'missing_app_build_identity';
  readonly message: string;
}

/**
 * Input captured by the app build identity boundary.
 */
interface CurrentAppBuildIdentityInput {
  readonly generatedAppVersion: string;
  readonly buildContext: BuildIdentityContext;
  readonly targetEnvironment: ReleaseEnvironment;
  readonly branch: BuildIdentityBranch;
}

/**
 * Resolve the app's canonical build identity from generated build data.
 */
export function resolveCurrentAppBuildIdentity(
  input: CurrentAppBuildIdentityInput,
): Result<AppBuildIdentity, AppBuildIdentityError> {
  if (input.generatedAppVersion === 'unknown') {
    return err({
      kind: 'missing_app_build_identity',
      message:
        'App build identity is still "unknown". Run the build identity generation step before starting the app.',
    });
  }

  return ok({
    value: input.generatedAppVersion,
    buildContext: input.buildContext,
    targetEnvironment: input.targetEnvironment,
    branch: input.branch,
  });
}
