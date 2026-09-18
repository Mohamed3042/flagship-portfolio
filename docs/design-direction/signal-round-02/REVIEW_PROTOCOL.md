# Director / Implementer exchange protocol

## Roles

**Owner:** decides scope, approves visual direction and authorizes production deployment.
**Director:** curates references, supplies named priorities and judges submitted evidence against the pinned direction.
**Implementer:** edits the application, runs it, reports tests and submits source/capture evidence.

GitHub is the shared record. It does not automatically connect the agents' private chats, trigger another agent, or cause either agent to read a reply. Each active session must explicitly fetch the latest thread and files. No continuous monitor or scheduled job is created by this pack.

Both tools may post under the same authorized GitHub account. Start every comment with role and round, so identity of the role is explicit rather than inferred from the account avatar.

## One thread, separate ownership

Use the director-pack draft PR conversation for this round. Do not scatter the discussion into several issues. The director owns `DIRECTOR_HANDOFF.md`, reference images and subsequent director verdicts. The implementer owns implementation code and a reply on the implementation branch. Neither silently rewrites the other's assessment.

Before editing, read all comments after the latest director message and note the implementation SHA. If the implementation has advanced, reconcile against the current files rather than applying an old patch blindly. A docs-only branch based on the showroom is not the current uncommitted Signal implementation.

Post captures and result files in an implementation review commit or as approved GitHub attachments. Keep full-resolution video outside ordinary Git history when unsuitable; link the exact evidence location. No private filesystem path is usable as proof for a remote reviewer by itself.

## Implementer reply

Use `replies/IMPLEMENTER_REPLY_TEMPLATE.md`. Include:

- Role, round, source branch, commit SHA, dirty-diff hash if applicable, and capture timestamp.
- The precise changed files and what each change resolves.
- Matching desktop and portrait poses plus normal-paced forward/reverse video.
- Actual device/browser or emulation, viewport, reduced-motion mode and rendering quality.
- Separate automated-test results and visual observations. Reuse neither old results nor a stale `ship` document.
- Remaining open items, source/privacy constraints and requested owner decisions.

Report each director criterion as `addressed`, `partial`, `blocked`, or `not tested`. The implementer's self-report is not director approval.

## Director reply

The director fetches the updated source and evidence and responds in the same thread. A reply identifies which criteria are resolved, partial, unresolved or unassessable. A visual review is not a field performance benchmark. Missing physical-device evidence stays missing, not assumed.

Each review should name the exact implementation commit and evidence set. An identical filename from an older branch does not establish freshness. Do not convert an old showroom approval into Signal approval.

## Release boundary

An approved docs PR does not approve the application. A visual pass does not authorize deployment. No agent force-pushes, resets another working tree, alters shared junction targets, starts paid rendering jobs, publishes private assets or deploys without the owner's authorization.

## Next-session instruction

Fetch the latest comments in this round's director-pack PR, read `DIRECTOR_HANDOFF.md`, open the linked reference images, inspect the current implementation and review manifest, then continue the named unresolved criteria. Do not restart the concept selection or ask for context already present there.
