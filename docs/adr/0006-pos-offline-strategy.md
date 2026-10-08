# ADR-0006: POS Offline Strategy

## Status
Accepted

## Context
The POS system must work in-store even when internet connectivity is unreliable (common in parts of Accra). Requirements:
- Sales must be creatable offline
- Data must not be lost
- Sales must sync when connectivity returns
- Cashier must see clear offline/online status
- Receipt numbers must be unique and sequential

## Decision
Use IndexedDB as an offline queue. Sales are queued locally when offline and flushed to the server when connectivity returns.

## Strategy

### Offline Detection
- Use `navigator.onLine` + online/offline events
- Show "Offline — sales will sync when back online" banner in POS

### Offline Queue (IndexedDB)
- When offline, sales are saved to IndexedDB with a temporary receipt number
- Each queued sale has a unique local ID and timestamp
- Queue is displayed in the UI ("3 sales pending sync")

### Sync Flow
1. On `online` event, flush queue in order (oldest first)
2. For each queued sale, POST to `/api/pos/sale`
3. Server assigns the real receipt number
4. Client updates local record with server-assigned number
5. If sync fails, retry with exponential backoff (max 3 attempts)
6. After 3 failures, mark as "sync failed" and alert cashier

### Receipt Numbers
- Server is the source of truth for receipt numbers
- Offline sales show "PENDING-XXX" until synced
- After sync, receipt number updates to server-assigned value

### Conflict Resolution
- No conflicts expected (single terminal, sequential sales)
- If two terminals are offline, server handles ordering by timestamp

## Rationale
- **IndexedDB:** Available in all modern browsers, no additional library needed
- **Simple:** No service worker complexity — just event-driven sync
- **Reliable:** IndexedDB persists across browser restarts
- **Transparent:** Cashier sees exactly what's queued and sync status

## Consequences
- Must implement IndexedDB wrapper (or use a lightweight library)
- Receipt numbers are not sequential during offline periods
- Must handle partial sync failures gracefully
- Cannot use IndexedDB in server components — POS terminal is fully client-rendered
- Testing requires simulating offline mode
