# Site PMIS — Early Warning System & Trigger Conditions Guide

This comprehensive guide details the automated early warning rule engine (`computeAlerts()`). It explains **every data field involved**, the **exact mathematical formulas**, the **specific conditions and timing when warnings occur**, their **severity tiers**, **cascading impacts**, and **recommended operational actions**.

---

## 🧭 Executive Summary Matrix

| Alert Rule | Primary Module | Severity | Trigger Condition / Formula | Key Fields Involved | Cascade Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Delayed Shipment** | Transportation | ⛔ **Critical** | `today > expectedDate + checkpointGraceDays` (and status $\neq$ Delivered) | `expectedDate`, `legStatus`, `checkpointGraceDays`, `linkedShipmentId` | Delays linked schedule construction activities (`activities`). |
| **2. Weather Disruption** | Transportation | ⛔ **Critical** / ⚠ **Warning** | `weatherFlag == 'Delayed'` (Critical) or `weatherFlag == 'Watch'` (Warning) | `weatherFlag`, `route`, `mode`, `materialName` | Strands marine cargo; delays worker crew change rotations. |
| **3. Must-Order-By Expiry** | Procurement | ⛔ **Critical** | `today > needBy - (supplierLead + transportLead + buffer)` (and status is Unordered) | `needBy`, `supplierLeadDays`, `transportLeadDays`, `bufferDays`, `status` | Causes construction laydown stockouts and project idle time. |
| **4. Expiring Certification** | Workforce | ⛔ **Critical** / ⚠ **Warning** | Days to `certExpiry` $\le 7\text{d}$ (Critical) or $8\text{–}30\text{d}$ (Warning) | `certExpiry`, `certName`, `trade`, `certAlertDays`, `rotationOut` | Worker legally disqualified from operating machinery. |
| **5. Low Fuel Stock** | Fuel / Transport | ⛔ **Critical** / ⚠ **Warning** | Fuel Runway $\le 3\text{d}$ (Critical) or $4\text{–}7\text{d}$ (Warning) | `fuelStockLiters`, `liters` (Consumption), `fuelAlertDays` | Site diesel generators and heavy haul fleet idle. |
| **6. Budget Overrun** | Cost & Schedule | ⚠ **Warning** | `committed + inTransit + installed > budget` | `budget`, `committed`, `inTransit`, `installed`, `costCode` | Negative cost variance; depletes project contingency fund. |

---

## 🔍 Detailed Field-by-Field Breakdown & Alert Rules

---

### 1. Delayed Shipment Behind Checkpoint

#### 📋 Fields Involved:
* **`shipments.expected_date` (`expectedDate`)**: The target arrival date (ISO format: `YYYY-MM-DD`) committed by the freight forwarder or logistics carrier for the current leg.
* **`shipments.leg_status` (`legStatus`)**: Current milestone stage (`Not Started`, `In Transit`, `At Checkpoint`, `Delivered`).
* **`shipments.material_name` (`materialName`)**: Cargo item description (e.g., *Cone Crusher Liners*, *Grinding Media*).
* **`shipments.route` (`route`)**: Logistics corridor path (e.g., *Manila Port → Surigao Hub → Site Laydown*).
* **`settings.checkpoint_grace_days` (`checkpointGraceDays`)**: Number of permitted buffer days before a delay triggers an official warning (default: `2 days`).
* **`activities.linked_shipment_id` (`linkedShipmentId`)**: Foreign key connecting this shipment to dependent construction activities in the Cost & Schedule module.

#### ⏱️ When and Why It Occurs:
The alert triggers when a shipment has **not arrived** (`legStatus !== 'Delivered'`) and the current calendar date exceeds the expected arrival date by more than the allowed grace days.

$$\text{Days Overdue} = (\text{Current Date} - \text{expectedDate}) - \text{checkpointGraceDays}$$
$$\text{Trigger Condition: } \text{Days Overdue} > 0$$

* *Example*: A shipment with `expectedDate = 2026-08-20` and `checkpointGraceDays = 2` will trigger a **Critical Alert** starting on **`2026-08-23`** if its status is still `In Transit` or `At Checkpoint`.

#### 🔴 Severity:
* ⛔ **Critical**: Directly impacts critical-path installation work.

#### 🌊 Cascading Impact:
The system cross-references `activities.linked_shipment_id` and explicitly lists all downstream activities (e.g., *Primary Crusher Erection*, *Conveyor 02 Mechanical*) that cannot proceed without this cargo.

#### 🛠️ SOP / Corrective Action:
1. Contact freight forwarder for vessel GPS tracking and port congestion status.
2. In the **Cost & Schedule** module, reschedule dependent activity start dates to prevent idle labor penalties.

---

### 2. Maritime & Corridor Weather Disruption

#### 📋 Fields Involved:
* **`shipments.weather_flag` (`weatherFlag`)**: Coastal and maritime bulletin classification (`None`, `Watch`, `Delayed`).
* **`shipments.route` (`route`)**: Geographic transit corridor (e.g., *Surigao Strait Marine Corridor*).
* **`shipments.mode` (`mode`)**: Transit mode (`Truck`, `Barge/Boat`, `Final-Mile`).
* **`shipments.material_name` (`materialName`)**: Name of cargo currently at sea or on transit roads.

#### ⏱️ When and Why It Occurs:
Remote island or mountainous mining sites rely heavily on sea barges and unpaved haul corridors vulnerable to typhoons, gale warnings, or heavy monsoon swells.
* **`Delayed`**: Port closures, Coast Guard no-sail advisories, or washed-out bridges.
* **`Watch`**: Approaching low-pressure area (LPA), gale warning, or forecasted monsoon surge.

#### 🔴 / 🟡 Severity:
* ⛔ **Critical**: When `weatherFlag == 'Delayed'` (physical movement halted).
* ⚠ **Warning**: When `weatherFlag == 'Watch'` (impending disruption within 24–48 hours).

#### 🌊 Cascading Impact:
* **Logistics**: Cargo vessels anchor at sea, accumulating daily barge charter / demurrage costs.
* **Workforce (Module 5)**: Incoming and outgoing worker rotation flights/ferries sharing the same corridor are delayed, risking un-manned operator shifts on site.

#### 🛠️ SOP / Corrective Action:
1. Divert incoming cargo to regional staging warehouses (*Cebu Hub* or *Surigao Port*).
2. Issue hotel billeting vouchers for off-rotation crew waiting at hub ports.

---

### 3. Procurement Lead-Time & Must-Order-By Expiration

#### 📋 Fields Involved:
* **`materials.name` (`name`)**: Name of spare part, structural steel, or consumable.
* **`materials.need_by` (`needBy`)**: Hard construction milestone date when the material must physically sit in the site laydown yard.
* **`materials.supplier_lead_days` (`supplierLeadDays`)**: Vendor manufacturing and factory testing time in days.
* **`materials.transport_lead_days` (`transportLeadDays`)**: Multi-modal shipping time from factory to remote site laydown in days.
* **`materials.buffer_days` (`bufferDays`)**: Risk contingency buffer (e.g., customs clearance, weather allowance) in days.
* **`materials.status` (`status`)**: Stage: `Ordered`, `Regional Hub`, `Provincial Port`, `Site Laydown`, `Installed`.

#### ⏱️ When and Why It Occurs:
The system continuously back-calculates the **Must-Order-By Date** required to ensure on-time delivery:

$$\text{Total Lead Time} = \text{supplierLeadDays} + \text{transportLeadDays} + \text{bufferDays}$$
$$\text{Must-Order-By Date} = \text{needBy} - \text{Total Lead Time}$$
$$\text{Trigger Condition: } \text{Current Date} > \text{Must-Order-By Date} \quad \text{AND} \quad \text{status} \text{ is not yet Ordered}$$

* *Example*: If an item is needed on site by `Nov 30`, with 45 days supplier lead time, 20 days transport, and 10 days buffer ($\text{Total} = 75\text{ days}$), the `Must-Order-By Date` is **`Sept 16`**. If `Sept 17` arrives and no PO has been released, the alert fires.

#### 🔴 Severity:
* ⛔ **Critical**: Every day of order delay results in a day of schedule delay on site.

#### 🌊 Cascading Impact:
Direct stockout during planned shutdown or construction installation windows.

#### 🛠️ SOP / Corrective Action:
1. Immediately release Purchase Order (PO) to the **Primary Supplier**.
2. If primary lead time is compromised, switch to the pre-approved **Backup Tier-2 Supplier** listed in Module 2.

---

### 4. Safety & Operating Certification Expiry

#### 📋 Fields Involved:
* **`workforce.name` (`name`)**: Worker's full name.
* **`workforce.trade` (`trade`)**: Job specialty (e.g., *Crane Operator*, *Substation Electrician*, *DOLE Rigger*).
* **`workforce.cert_name` (`certName`)**: Name of regulatory certificate or operating license (e.g., *TESDA NC II Heavy Equipment*, *DOLE BOSH*).
* **`workforce.cert_expiry` (`certExpiry`)**: Expiration date of the certification.
* **`workforce.rotation_out` (`rotationOut`)**: Scheduled fly-out date for this worker's current on-site tour.
* **`settings.cert_alert_days` (`certAlertDays`)**: Advance warning window in days (default: `30 days`).

#### ⏱️ When and Why It Occurs:
Mine safety regulations (DOLE / MGB) prohibit uncertified operators from running cranes, high-voltage substations, or heavy mining equipment.

$$\text{Days Remaining} = \text{certExpiry} - \text{Current Date}$$
$$\text{Trigger Condition: } \text{Days Remaining} \le \text{settings.certAlertDays}$$

#### 🔴 / 🟡 Severity:
* ⛔ **Critical**: When $\text{Days Remaining} \le 7\text{ days}$ (immediate grounding risk).
* ⚠ **Warning**: When $8 \le \text{Days Remaining} \le \text{certAlertDays}$ ($8\text{–}30\text{ days}$).

#### 🌊 Cascading Impact:
* If a crane operator's cert expires while on site, the crane cannot operate legally, halting heavy structural lifts.

#### 🛠️ SOP / Corrective Action:
1. Compare `certExpiry` with `rotationOut`. If the certificate expires *before* the worker's scheduled fly-out, arrange for early rotation or schedule third-party testing on site.
2. Dispatch a certified replacement worker from the off-rotation pool.

---

### 5. Fuel Stock Runout (Site Autonomy Depletion)

#### 📋 Fields Involved:
* **`settings.fuel_stock_liters` (`fuelStockLiters`)**: Total live diesel volume physically stored in site bulk tanks.
* **`fuel_log.liters` (`liters`)**: Volume of diesel drawn or consumed in daily logs.
* **`fuel_log.type` (`type`)**: Filtered for entries where `type === 'Consumption'`.
* **`settings.fuel_alert_days` (`fuelAlertDays`)**: Minimum required days of fuel autonomy buffer (default: `7 days`).

#### ⏱️ When and Why It Occurs:
Remote mine sites operate off-grid powered by diesel generator power stations and heavy diesel haul fleets. The system calculates historical consumption velocity and estimates runway:

$$\text{Average Daily Burn (L/day)} = \frac{\sum \text{Consumption Liters}}{\text{Number of Consumption Log Entries}}$$
$$\text{Days of Fuel Remaining} = \frac{\text{settings.fuelStockLiters}}{\text{Average Daily Burn}}$$
$$\text{Trigger Condition: } \text{Days of Fuel Remaining} \le \text{settings.fuelAlertDays}$$

* *Example*: If the site tanks hold $35,000\text{ L}$ and the average draw is $7,000\text{ L/day}$, fuel runway is **$5\text{ days}$**. Since $5 \le 7$, a warning alert is triggered.

#### 🔴 / 🟡 Severity:
* ⛔ **Critical**: When Fuel Runway $\le 3\text{ days}$ (total blackout and site shutdown risk).
* ⚠ **Warning**: When $4 \le \text{Fuel Runway} \le \text{fuelAlertDays}$ ($4\text{–}7\text{ days}$).

#### 🌊 Cascading Impact:
* Primary power plant shuts down, halting ball mills, crushers, camp power, and water treatment.

#### 🛠️ SOP / Corrective Action:
1. Dispatch emergency fuel tanker barge from regional fuel depot.
2. Implement fuel conservation protocol (shut down non-critical auxiliary generators and reduce non-essential haulage).

---

### 6. Activity Budget Cost Overrun & Variance

#### 📋 Fields Involved:
* **`activities.name` (`name`)**: Work Breakdown Structure (WBS) activity title (e.g., *Primary Crusher Civils*).
* **`activities.cost_code` (`costCode`)**: Cost allocation code (e.g., `C-101`, `M-204`, `E-301`).
* **`activities.budget` (`budget`)**: Authorized financial budget ceiling for this cost code.
* **`activities.committed` (`committed`)**: Purchase orders issued, contracts signed, and committed spend.
* **`activities.in_transit` (`inTransit`)**: Freight and active logistics expenditures currently underway.
* **`activities.installed` (`installed`)**: Value of physically completed, inspected work on site.
* **`activities.variance` (Calculated)**: Total financial health indicator.

#### ⏱️ When and Why It Occurs:
The total financial exposure of any activity is the sum of committed funds, in-transit logistics, and executed works.

$$\text{Total Spend} = \text{committed} + \text{inTransit} + \text{installed}$$
$$\text{Variance} = \text{budget} - \text{Total Spend}$$
$$\text{Trigger Condition: } \text{Total Spend} > \text{budget} \quad (\text{Variance} < 0)$$

#### 🟡 Severity:
* ⚠ **Warning**: Financial variance requires commercial audit and contingency allocation.

#### 🌊 Cascading Impact:
* Depletes project contingency reserves and signals contractor over-billing or scope creep.

#### 🛠️ SOP / Corrective Action:
1. Review committed invoices and contractor claims against bill of quantities (BOQ).
2. Request a formal Scope Change Order (SCO) or Management Reserve drawdown from project leadership.

---

### 7. Workforce Attendance & Daily Shift Muster

#### 📋 Fields Involved:
* **`workforce_attendance.date` (`date`)**: Selected muster date.
* **`workforce_attendance.worker_id` (`workerId`)**: Linked worker record.
* **`workforce_attendance.status` (`status`)**: Daily status (`Present`, `Late`, `Absent`, `Off Rotation`).
* **`workforce_attendance.time_in` / `time_out` (`timeIn`, `timeOut`)**: Shift entry and exit timestamps.
* **`workforce_attendance.hours_worked` (`hoursWorked`)**: Computed shift duration in hours.

#### ⏱️ Operational Tracking:
* Allows supervisors to inspect attendance for **`Today`**, **`Yesterday`**, or any calendar date.
* Flags unlogged personnel on shift days to prevent un-manned operating posts.
