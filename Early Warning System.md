# Site PMIS — Early Warning & Risk System Guide
*A plain-English operational guide for Project Managers, Site Engineers, and Field Supervisors.*

---

## 🧭 Quick Summary of the 7 Early Warning Rules

| Warning Name | Module in App | Severity Level | When Does It Trigger? | Impact on the Project |
| :--- | :--- | :--- | :--- | :--- |
| **1. Delayed Shipment** | 🚚 Transport & Cost | ⛔ **Critical** | When cargo has not arrived after its **Expected Date** plus the **Grace Period (2 days)**. | Construction work depending on these materials is delayed. |
| **2. Route Weather Alert** | 🚚 Transport & Cost | ⛔ **Critical** / ⚠ **Warning** | When a travel corridor has a **Delayed** (typhoon/port closure) or **Watch** (gale/rough seas) flag. | Boats and trucks are stranded; incoming/outgoing worker rotations are disrupted. |
| **3. Must-Order-By Passed** | 📦 Procurement | ⛔ **Critical** | When today's date is past the calculated **Must-Order-By Date** and the material has not been ordered yet. | Materials will arrive late, leading to site work stoppage. |
| **4. Expiring Certification** | 👥 Workforce | ⛔ **Critical** / ⚠ **Warning** | When a worker's safety or equipment license is expiring within **30 days** (Warning) or **7 days** (Critical). | Worker is legally disqualified from operating machinery or entering high-risk areas. |
| **5. Low Fuel Stock** | ⛽ Transport & Cost | ⛔ **Critical** / ⚠ **Warning** | When remaining diesel in the site tanks is down to **7 days** (Warning) or **3 days** (Critical). | Site diesel generators and heavy equipment will run out of power. |
| **6. Budget Cost Overrun** | 💰 Cost & Schedule | ⚠ **Warning** | When total money spent (**Committed + In Transit + Installed**) is higher than the approved **Budget**. | The activity is losing money and cutting into project contingency reserves. |
| **7. Camp Bed Road Delay & Handover** | 👥 Workforce / Camp Beds | ⛔ **Critical** / ⚠ **Warning** | When outbound transport encounters weather/mud delays extending bed stay (+24h), or a bed has a same-day shift handover. | Outbound workers are stranded; inbound workers risk double-booking (hot-bedding) or uncleaned rooms. |

---

## 🔍 Detailed Explanations of Each Rule & App Fields

---

### Rule 1: Delayed Shipment Behind Checkpoint

#### 📱 Fields in the App Used for this Rule:
* **Cargo / Material**: The name of the equipment or materials being shipped (e.g., *Cone Crusher Liners*, *HDPE Pipes*).
* **Expected Date**: The target arrival date agreed with the shipping contractor.
* **Status**: Current tracking stage (*Not Started*, *In Transit*, *At Checkpoint*, *Delivered*).
* **Alert Grace Period**: The allowable delay buffer before raising a formal alert (configured under Site Settings, standard is **2 days**).
* **Linked Activity**: The specific site construction job that is waiting for this cargo.

#### ⏱️ When Does It Occur?
* This alert turns **RED (Critical)** when cargo is still **"In Transit"** or **"At Checkpoint"** and the calendar has passed the **Expected Date by more than 2 days**.
* **Plain Example**:
  * Expected arrival date is **August 20**.
  * Grace period is **2 days** (until August 22).
  * On **August 23**, if the status is still *In Transit*, the system triggers an immediate **Delayed Shipment Alert**.

#### 💥 What Happens on Site?
* The system checks which construction task is linked to this shipment and flags it (for example: *"Affects activity: Primary Crusher Mechanical Erection"*).

#### ✅ What Action is Needed?
1. Contact the shipping agent or barge captain to get the exact location.
2. Adjust the construction work schedule so laborers are not standing idle waiting for materials.

---

### Rule 2: Route Weather Alert

#### 📱 Fields in the App Used for this Rule:
* **Weather**: The sea or road corridor condition (*None*, *Watch*, *Delayed*).
* **Route**: The travel path (e.g., *Cebu Port to Lipata Port to Site*).
* **Current Leg Mode**: How it travels (*Truck*, *Barge/Boat*, *Final-Mile Road*).
* **Material / Cargo**: The shipment travelling through that corridor.

#### ⏱️ When Does It Occur?
* **⛔ Critical (Red)**: Occurs when a route is marked **"Delayed"** (e.g., Coast Guard has suspended boat sailings due to Typhoon Signal No. 2, or roads are blocked by landslides).
* **⚠ Warning (Amber)**: Occurs when a route is on **"Watch"** (e.g., Gale warning, heavy rains forecasted within 24 to 48 hours).

#### 💥 What Happens on Site?
* Sea barges must anchor and wait, which incurs extra daily boat rental and port fees (Demurrage).
* Workers travelling to or from the mine for their shift rotation might get stranded in port cities.

#### ✅ What Action is Needed?
1. Secure sensitive cargo at regional transit hubs.
2. Arrange temporary hotel lodging for stranded personnel at transit ports.

---

### Rule 3: Must-Order-By Date Passed (Procurement Lead Time)

#### 📱 Fields in the App Used for this Rule:
* **Item**: Name of the material or spare part.
* **Need By**: The required date when the material must physically sit on site ready for work.
* **Supplier Lead (Days)**: How many days the factory takes to manufacture and pack the item.
* **Transport Lead (Days)**: How many days it takes to ship from the supplier to the mine site.
* **Buffer (Days)**: Extra safety days added for customs clearance or unexpected shipping delays.
* **Must Order By (Calculated by App)**: The latest date you can place the purchase order.
  * **Formula**: `Need By Date` minus `(Supplier Lead + Transport Lead + Buffer Days)`
* **Status**: Procurement state (*Ordered*, *Regional Hub*, *Provincial Port*, *Site Laydown*, *Installed*).

#### ⏱️ When Does It Occur?
* This alert turns **RED (Critical)** when today's date has passed the calculated **Must-Order-By Date** and the material has **not yet been marked as "Ordered"**.
* **Plain Example**:
  * You need steel plates on site on **December 1**.
  * Supplier takes **30 days** to make them.
  * Shipping takes **15 days**.
  * Safety buffer is **5 days**.
  * Total lead time is **50 days**.
  * The **Must-Order-By Date** is **October 12**.
  * If October 13 arrives and the status is still not *Ordered*, the system immediately raises a **Critical Procurement Warning**.

#### 💥 What Happens on Site?
* If you do not order now, the material will arrive after the installation start date, shutting down the work crew.

#### ✅ What Action is Needed?
1. Release the Purchase Order (PO) to the **Primary Supplier** immediately.
2. If the primary supplier is overloaded, switch to the **Backup Supplier** listed in the Supplier Directory.

---

### Rule 4: Expiring Worker Certification

#### 📱 Fields in the App Used for this Rule:
* **Worker**: Full name of the employee or technician.
* **Trade / Role**: Their assigned job (e.g., *Crane Operator*, *High Voltage Electrician*, *Heavy Equipment Mechanic*).
* **Certification**: The mandatory safety or government license (e.g., *TESDA Crane NC II*, *DOLE Safety Officer*).
* **Cert Expiry**: The official expiration date on their license card.
* **Rotation Out**: The date when this worker is scheduled to fly out from the site for their rest days.
* **Alert Window**: How many days before expiry the app starts notifying you (default is **30 days**).

#### ⏱️ When Does It Occur?
* **⛔ Critical (Red)**: Triggers when the certificate has **7 days or fewer** remaining before expiring.
* **⚠ Warning (Amber)**: Triggers when the certificate has **between 8 and 30 days** remaining.

#### 💥 What Happens on Site?
* Mine safety regulations strictly prohibit uncertified operators from running heavy equipment.
* If a crane operator's license expires while on site, the crane cannot operate, stopping all heavy lifting work.

#### ✅ What Action is Needed?
1. Check if the worker is scheduled to fly out (**Rotation Out**) before the license expires.
2. Schedule their renewal test during their off-rotation rest period, or bring in a certified backup operator.

---

### Rule 5: Low Fuel Stock (Site Autonomy Depletion)

#### 📱 Fields in the App Used for this Rule:
* **Current Fuel Stock (L)**: Total liters of diesel currently in the main site storage tanks.
* **Liters Consumed**: Daily fuel drawn by generators, excavators, and dump trucks recorded in the Fuel Log.
* **Average Daily Consumption (Calculated)**: The average liters burned per day across all logged entries.
* **Days of Fuel Remaining (Calculated)**: `Current Fuel Stock` divided by `Average Daily Consumption`.
* **Alert Threshold (Days)**: Minimum safety runway (configured in Settings, default is **7 days**).

#### ⏱️ When Does It Occur?
* **⛔ Critical (Red)**: Triggers when remaining fuel is down to **3 days or less**.
* **⚠ Warning (Amber)**: Triggers when remaining fuel is between **4 and 7 days**.
* **Plain Example**:
  * The site tanks have **28,000 Liters** of diesel.
  * The site burns an average of **7,000 Liters per day**.
  * Fuel runway is **4 days** ($28,000 \div 7,000$).
  * Since 4 days is less than the 7-day safety threshold, the system raises a **Fuel Warning**.

#### 💥 What Happens on Site?
* If fuel runs out, the main power generators stop, shutting down processing mills, water treatment, camp lights, and mobile heavy equipment.

#### ✅ What Action is Needed?
1. Expedite the next fuel tanker barge or road tanker delivery immediately.
2. If delivery is delayed, turn off non-essential camp air conditioners and prioritize primary power for processing equipment.

---

### Rule 6: Activity Budget Cost Overrun

#### 📱 Fields in the App Used for this Rule:
* **Activity**: Name of the construction or maintenance job (e.g., *Primary Crusher Foundation*).
* **Cost Code**: The financial accounting code (e.g., `C-101`, `M-204`).
* **Budget**: The approved maximum money allocated for this activity.
* **Committed**: Purchase orders and contractor contracts already signed.
* **In Transit**: Freight and shipping costs currently on the way.
* **Installed / Earned**: Work already completed and paid on site.
* **Total Spent (Calculated)**: `Committed + In Transit + Installed`.
* **Variance (Calculated)**: `Budget` minus `Total Spent`.

#### ⏱️ When Does It Occur?
* **⚠ Warning (Amber)**: Triggers whenever **Total Spent** is greater than the **Budget** (resulting in a negative variance shown in red in the app).
* **Plain Example**:
  * Budget is **₱1,000,000**.
  * Committed is **₱500,000**, In-Transit is **₱200,000**, and Installed work is **₱400,000**.
  * Total Spent is **₱1,100,000**.
  * The activity is **₱100,000 over budget**, triggering an immediate Cost Variance Warning.

#### 💥 What Happens on Site?
* The activity is burning through money faster than planned, eating into the overall project contingency reserve.

#### ✅ What Action is Needed?
1. Review contractor invoices to check for overcharging or unapproved extra work.
2. Request a formal management budget approval or change order if the scope of work was expanded.

---

### Rule 7: Camp Bed Road Delay & Handover (Anti-Hot-Bedding Safety)

#### 📱 Fields in the App Used for this Rule:
* **Room / Bed ID**: Specific bunk identifier in the site camp (e.g., `MH-A-01`, `MH-B-02`).
* **Current Occupant**: Name of the employee or contractor currently housed in the bed.
* **Vacating Date**: The planned date when the worker is scheduled to leave site.
* **Road Delay Safety Extension (`roadDelayExt` / +24h Ext)**: Safety flag activated when outbound transport convoys or flights are delayed by weather, landslides, or impassable roads.
* **Next Reserved Occupant**: The inbound technician travelling to site scheduled to take over the bed upon handover.
* **Bed Status**: Real-time room lifecycle state (*🔴 Occupied*, *🟡 Pending Handover*, *🔵 Housekeeping*, *🟢 Available*).

#### ⏱️ When Does It Occur?
* **⛔ Critical (Red) — Road Delay Bed Extension**:
  * Triggers when a bed has an active **Road Delay Safety Extension (+24h)**.
  * **Plain Example**: Outbound convoy is halted due to heavy mud on the access road. Outbound occupant's stay is extended by +24 hours to prevent leaving them without a roof. Inbound worker is held in transit staging to prevent room double-booking ("hot-bedding").
* **⚠ Warning (Amber) — Same-Day Bed Turnover**:
  * Triggers when a bed status is **"Pending Handover"** and the **Vacating Date is Today**.
  * **Plain Example**: Worker is vacating today; the system warns camp management that Housekeeping linen disinfection must be signed off before checking in the arriving worker.

#### 💥 What Happens on Site?
* Eliminates the risk of **hot-bedding** (assigning two workers to the same bed without sanitation).
* Prevents evicting departing workers when outbound buses or boats cannot depart due to typhoons or road closures.

#### ✅ What Action is Needed?
1. **For Road Delay Alerts**: Keep the outbound worker safely housed in their assigned bed. Stage the incoming worker in transit staging or overflow bunks until the outbound convoy clears.
2. **For Same-Day Handover**: As soon as the departing worker leaves, click **"Send to Housekeeping"** (🔵). Once cleaned and disinfected, click **"Sanitation Cleared"** (🟢) before using **"Check-In Inbound"** (🔴).

---

### 📅 Bonus: Workforce Daily Attendance & Time Tracking

#### 📱 Fields in the App:
* **Selected Date**: Switch easily between **Today**, **Yesterday**, or pick any date from the calendar.
* **Worker & Trade**: Worker full name and job role.
* **Attendance Status**:
  * 🟢 **Present**: Worked a full normal shift.
  * 🟡 **Late**: Arrived late or worked a partial shift.
  * 🔴 **Absent**: Did not report for duty on their scheduled shift day.
  * ⚪ **Off Rotation**: Worker is currently home on their rest cycle.
* **Time In**: Actual time the worker clocked in for the shift (e.g., `07:00`).
* **Time Out**: Actual time the worker clocked out at the end of the shift (e.g., `17:00`).
* **Hours Worked**: The app automatically computes total shift hours (e.g., `07:00` to `17:00` = `10.0 hours`).
* **Notes / Work Area**: Specific location or task (e.g., *Crusher foundation formwork*, *Night shift OT*).
