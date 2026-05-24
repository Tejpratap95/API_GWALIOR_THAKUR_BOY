# CricMind AI - Security Specifications & ABAC Invariants

This document outlines the security rules invariants, the **"Dirty Dozen"** vulnerability payloads, and tests mapped to Firestore collection structures.

## 1. Data Invariants
- **Identity Integrity**: A user can never write history logs under another user's UID coordinates.
- **Strict Size Guarding**: Prompts cannot exceed 5,000 characters and Gemini responses cannot exceed 100,000 characters to block Wallet Exhaustion or Buffer Attacks.
- **Immutability of AI History logs**: A history document is write-once, read-by-owner. Updates and deletions are blocked (`allow update, delete: if false`).

## 2. The "Dirty Dozen" Attack Payloads (PERMISSION_DENIED Targets)

1. **The Identity Spoof (Create)**: Set target `userId` = `different_uid` while authed as `user_123`.
2. **The Anonymous Write (Create)**: Attempting to save a history item while and unauthenticated `request.auth == null` action.
3. **The Buffer Exploit (Create)**: Sending `prompt` with a size of 10MB of repeating bytes.
4. **The Ghost Field Attack (Create)**: Writing unapproved schemas (e.g. adding `isAdmin: true` or `bountyPoints: 99999`) to bypassing mapping structures.
5. **The ID Poisoning Assault (Create)**: Document target ID is 5,000 characters with special regex hacks `/history/$$$!!!INVALID_UNICODE_CHARACTERS`.
6. **The Read Scrape (List)**: Non-owner fetching private histories `/history` collection without filtering `where("userId", "==", request.auth.uid)`.
7. **The Snooping Read (Get)**: Reading `/history/user_123_insight` while logged in as `user_456`.
8. **The State Shortcut (Update)**: Attempting to modify AI responses (`response` payload changes) after insertion.
9. **The Historical Erase (Delete)**: Deleting a logged prediction item to wipe records/telemetry.
10. **The Email Spoofing Assault (Create)**: Attempting to declare `userEmail` as `admin@cricmind.ai` while having `email_verified == false`.
11. **System Value Poisoning (Update)**: Trying to append arbitrary fields to existing documents during partial update transitions.
12. **The Relational Sync Hack (Create)**: Setting `createdAt` to a future timestamp from the client device instead of checking sync integrity.

---

## 3. Test Cases (firestore.rules)
All cases listed above must return `PERMISSION_DENIED`. Complete security configurations are finalized in `/firestore.rules`.
