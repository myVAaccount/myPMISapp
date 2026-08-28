# Site PMIS — Early Warning System & Trigger Conditions Guide

This document outlines the automated rule engine implemented in `computeAlerts()`. It defines the exact thresholds, timing rules, severity tiers, and operational cascade impacts for all early warnings.

---

## Summary Matrix of Trigger Rules

| Rule | Module | Severity | Trigger Condition / Formula | Cascade Impact |
| :--- | :--- | :--- | :--- | :--- |
| **1. Delayed Shipment** | Transportation | ⛔ **Critical** | `legStatus != 'Delivered'` AND `today > expectedDate + checkpointGraceDays` | Flags dependent schedule activities (`linkedShipmentId`). |
| **2. Route Weather Flag** | Transportation | ⛔ **Critical** / ⚠ **Warning** | `weatherFlag == 'Delayed'` (Critical) or `weatherFlag == 'Watch'` (Warning) | Warns of cargo stranding & worker crew change rotation delays. |
| **3. Past Must-Order-By** | Procurement | ⛔ **Critical** | `status` not in `['Ordered', 'Regional Hub', 'Provincial Port', 'Site Laydown', 'Installed']` AND `today > needBy - (supplierLead + transportLead + buffer)` | Imminent material stockout; delays construction start. |
| **4. Expiring Certification** | Workforce | ⛔ **Critical** / ⚠ **Warning** | Days to `certExpiry` $\le 7$ (Critical) or $8 \le$ Days $\le \text{certAlertDays}$ (Warning) | Worker cannot operate machinery; role goes unmanned. |
| **5. Low Fuel Stock** | Transportation / Fuel | ⛔ **Critical** / ⚠ **Warning** | Fuel Runway $\le 3\text{ days}$ (Critical) or $4 \le \text{Runway} \le \text{fuelAlertDays}$ (Warning) | Diesel generators & haul fleet idle; site shutdown risk. |
| **6. Budget Overrun** | Cost & Schedule | ⚠ **Warning** | `(committed + inTransit + installed) > budget` | Negative cost variance on cost code; contingency drawdown. |

---

## Detailed Rule Explanations & Escalation Protocols

### 1. Delayed Shipment Behind Checkpoint
* **When it occurs**: A cargo shipment is still marked as `In Transit`, `At Checkpoint`, or `Not Started`, and the current date exceeds `expectedDate` by more than `checkpointGraceDays` (configurable in settings, default is 2 days).
* **Formula**:
  $$\text{Days Behind} = (\text{today} - \text{expectedDate}) - \text{checkpointGraceDays} > 0$$
* **Severity**: ⛔ **Critical**
* **Action Required**: Contact logistics coordinator, verify vessel/truck position, and reschedule linked activity in Module 6.

---

### 2. Weather Disruption Along Route Corridor
* **When it occurs**: A shipment's transit corridor receives a weather bulletin (`weatherFlag` set to `Watch` or `Delayed`).
* **Severity**:
  * ⛔ **Critical**: When flagged as `Delayed` (e.g. Philippine Coast Guard port closure / Typhoon Signal No. 2+).
  * ⚠ **Warning**: When flagged as `Watch` (e.g. Monsoon surge / Gale warning).
* **Action Required**: Prepare laydown yard for delayed arrival; check if incoming personnel sharing the maritime route need emergency hotel billeting at regional hubs.

---

### 3. Procurement Must-Order-By Lead Time Expiry
* **When it occurs**: An essential material has not yet reached `Ordered` status, and the current date is past the calculated `Must-Order-By` threshold.
* **Formula**:
  $$\text{Must-Order-By Date} = \text{needBy} - (\text{supplierLeadDays} + \text{transportLeadDays} + \text{bufferDays})$$
  $$\text{Alert occurs if: } \text{today} > \text{Must-Order-By Date} \quad \text{AND} \quad \text{status} == \text{Unordered}$$
* **Severity**: ⛔ **Critical**
* **Action Required**: Immediately issue purchase order to primary supplier or switch to backup tier-2 supplier if expedited manufacturing is required.

---

### 4. Safety & Operating Certification Expiry
* **When it occurs**: A technician's mandatory safety certification is set to expire within the alert window (`certAlertDays`, default 30 days).
* **Severity**:
  * ⛔ **Critical**: If expiration is within $\le 7\text{ days}$.
  * ⚠ **Warning**: If expiration is within $8 \text{ to } 30\text{ days}$.
* **Action Required**: Schedule DOLE / third-party re-certification on next `Rotation Out`, or dispatch certified backup worker.

---

### 5. Fuel Stock Runout (Autonomy Depletion)
* **When it occurs**: Calculated diesel stock autonomy drops below the minimum configured runway (`fuelAlertDays`, default 7 days).
* **Calculation**:
  $$\text{Average Daily Burn} = \frac{\sum \text{Consumption Liters}}{\text{Total Consumption Records}}$$
  $$\text{Days of Fuel Remaining} = \frac{\text{Current Tank Stock (Liters)}}{\text{Average Daily Burn}}$$
* **Severity**:
  * ⛔ **Critical**: Days of fuel remaining $\le 3\text{ days}$.
  * ⚠ **Warning**: Days of fuel remaining $\le \text{fuelAlertDays}$ (4 to 7 days).
* **Action Required**: Expedite tanker fuel barge dispatch; prioritize power generation for critical processing units over non-essential utility circuits.

---

### 6. Activity Budget Cost Overrun
* **When it occurs**: Total financial commitment + freight in transit + completed physical work exceeds the approved baseline budget for a given WBS activity.
* **Formula**:
  $$\text{Total Spend} = \text{committed} + \text{inTransit} + \text{installed}$$
  $$\text{Alert occurs if: } \text{Total Spend} > \text{budget}$$
* **Severity**: ⚠ **Warning**
* **Action Required**: Submit engineering change notice (ECN) or request contingency allocation from project director.
