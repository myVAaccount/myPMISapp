# Site PMIS — Complete Field Reference Dictionary
*A clear, non-technical reference guide for all fields across every screen in the Site PMIS application.*

---

## 1. 📦 Procurement Screen (Materials & Ordering)

| Field Name in App | What Does It Mean? | Example Value | Why Is It Important? |
| :--- | :--- | :--- | :--- |
| **Item** | The name or description of the equipment, structural steel, or consumables needed on site. | `Cone Crusher Liners` | Identifies the physical part needed for maintenance or construction. |
| **Supplier** | The company or vendor supplying the item. | `Metso Outotec Phils` | Used to contact the vendor and track supplier performance. |
| **Qty** | The total quantity or units required. | `4` | Determines purchase volume and freight sizing. |
| **Unit Cost** | The purchase price per individual unit in Philippine Pesos. | `₱250,000` | Multiplied by quantity to calculate the total procurement spend. |
| **Supplier Lead (d)** | How many days the factory takes to manufacture and prepare the item for shipping. | `45` | Critical for back-calculating when the purchase order must be issued. |
| **Transport Lead (d)** | Estimated transit days required for road haulage and sea barging from the vendor to the remote site. | `15` | Accounts for shipping duration across islands. |
| **Buffer (d)** | Extra safety days added to absorb potential customs delays, weather holds, or port congestion. | `7` | Prevents late deliveries if transport encounters normal delays. |
| **Need By** | The deadline date when the material must physically sit in the site laydown yard. | `Nov 30, 2026` | Tied to the scheduled start date of the construction activity. |
| **Must Order By** | *Calculated automatically by the app*: `Need By Date` minus (`Supplier Lead` + `Transport Lead` + `Buffer`). | `Sep 23, 2026` | The hard cutoff date to place the purchase order without delaying the project. |
| **Status** | The current staging milestone of the cargo. | `Ordered`, `Regional Hub`, `Provincial Port`, `Site Laydown`, `Installed` | Shows where the item is physically located along the supply chain. |

---

## 2. 🏢 Supplier Database Screen

| Field Name in App | What Does It Mean? | Example Value | Why Is It Important? |
| :--- | :--- | :--- | :--- |
| **Supplier** | Official name of the distributor, fabricator, or vendor. | `Apex Industrial Steel` | Identifies the commercial vendor. |
| **Item Category** | The category of items supplied. | `Grinding Media` | Allows quick filtering of vendors by product type. |
| **Tier** | Classification of the supplier: **Primary** (standard vendor) or **Backup** (emergency secondary vendor). | `Primary` / `Backup` | Enables quick switching to a backup supplier if the primary vendor is delayed. |
| **Avg Lead (d)** | Historical average duration from PO issuance to dispatch. | `30` | Benchmark used to detect vendor delays. |
| **Reliability %** | On-time and in-full fulfillment percentage based on past orders. | `95%` | Measures supplier performance and reliability. |
| **Primary Route** | Normal transit corridor used by this vendor. | `Manila to Surigao Port` | Helps coordinate multi-modal shipping logistics. |

---

## 3. 🚚 Transport & Cost Screen (Shipments & Landed Cost)

| Field Name in App | What Does It Mean? | Example Value | Why Is It Important? |
| :--- | :--- | :--- | :--- |
| **Material / Cargo** | Cargo item name or linked material. | `Ball Mill Shell Liner Plates` | Identifies the physical shipment. |
| **Route** | The transit path from origin to site laydown. | `Cebu Port → Lipata Port → Site` | Defines checkpoints along the corridor. |
| **Current Leg Mode** | Active transport method for this segment of the trip. | `Truck`, `Barge/Boat`, `Final-Mile` | Allows tracking road vs. maritime transit risks. |
| **Status** | Current leg progress: `Not Started`, `In Transit`, `At Checkpoint`, `Delivered`. | `In Transit` | Triggers delayed shipment alerts if overdue. |
| **Expected** | Estimated arrival date at destination or site laydown. | `Aug 20, 2026` | Benchmark date used to detect shipment delays. |
| **Actual** | Real physical arrival date and time. | `Aug 22, 2026` | Confirms delivery and stops delay tracking. |
| **Weather** | Weather condition flag for the corridor: `None`, `Watch`, `Delayed`. | `Watch` / `Delayed` | Warns of typhoons, rough seas, or impassable roads. |
| **Freight** | Base carrier shipping and trucking fee. | `₱120,000` | Direct transport cost. |
| **Fuel Surch.** | Diesel / bunker fuel surcharge billed by shipping lines. | `₱15,000` | Variable fuel index fee. |
| **Demurrage** | Port holding and barge standby penalties for delayed unloading. | `₱25,000` | Unplanned delay penalty cost. |
| **Handling** | Stevedoring, crane rigging, and port terminal charges. | `₱18,000` | Cargo loading and transfer fees. |
| **Insurance** | Cargo marine transit risk coverage policy cost. | `₱8,000` | Protects against damage or loss at sea. |
| **Landed Cost** | *Calculated automatically by the app*: `Freight + Fuel Surcharge + Demurrage + Handling + Insurance`. | `₱186,000` | True total cost to deliver the cargo to the remote site. |

---

## 4. ⛽ Fuel Sub-Ledger Screen

| Field Name in App | What Does It Mean? | Example Value | Why Is It Important? |
| :--- | :--- | :--- | :--- |
| **Date** | Date of the fuel delivery or daily consumption log. | `Aug 28, 2026` | Tracks daily diesel burn history. |
| **Type** | Classification: **Delivery** (tank refill) or **Consumption** (fuel burned). | `Consumption` | Used to calculate the site's average daily burn rate. |
| **Liters** | Volume of diesel in liters. | `6,500` | Tracks fuel volume drawdown or refill. |
| **Cost** | Total invoice cost (for deliveries). | `₱422,500` | Tracks diesel fuel operational expenses. |
| **Notes / Equipment** | Machine fleet or power generator ID. | `GenSet #1 & Excavator CAT336` | Helps identify which equipment is consuming the most fuel. |
| **Current Fuel Stock (L)** | Live diesel volume currently inside the site storage tanks. | `35,000 L` | Numerator used to compute days of fuel remaining. |
| **Alert Threshold (Days)** | Minimum safety runway before a warning is raised (configured in Settings). | `7 days` | Safety buffer ensuring fuel re-orders arrive before tanks run dry. |

---

## 5. 👥 Workforce Screen (Attendance, Time In/Out & Certifications)

| Field Name in App | What Does It Mean? | Example Value | Why Is It Important? |
| :--- | :--- | :--- | :--- |
| **Worker** | Full name of the employee or technician. | `Juan Dela Cruz` | Identifies the workforce member. |
| **Trade / Role** | Operational specialty or job position. | `Tower Crane Operator` | Verifies manning levels for critical site positions. |
| **Rotation In** | Start date of current on-site tour. | `Aug 15, 2026` | Tracks when the worker arrived on site. |
| **Rotation Out** | Scheduled fly-out date for rest rotation. | `Aug 29, 2026` | Used to plan crew changes and transport seats. |
| **Certification** | Mandatory safety license or equipment cert. | `TESDA Crane Operator NC II` | Ensures regulatory and DOLE safety compliance. |
| **Cert Expiry** | Date when the certification expires. | `Sep 15, 2026` | Triggers early warning if cert is expiring soon. |
| **Deployment Status** | Physical deployment: **On Site** or **Off Rotation**. | `On Site` | Identifies who is physically on the project site. |
| **Selected Date (Calendar)** | The date being inspected in the attendance log. | `Today`, `Yesterday`, `Aug 28, 2026` | Allows looking up past daily shift attendance. |
| **Attendance Status** | Presence on shift: `Present`, `Late`, `Absent`, `Off Rotation`. | `Present` | Measures daily labor attendance. |
| **Time In** | Clock-in time for the shift. | `07:00` | Tracks start of working hours. |
| **Time Out** | Clock-out time at shift completion. | `17:00` | Tracks end of working hours. |
| **Hours Logged** | *Calculated automatically by the app*: Total shift duration. | `10.0 hrs` | Used for man-hour tracking and labor productivity reports. |

---

## 6. 💰 Cost & Schedule Screen (Budget vs. Spend Integration)

| Field Name in App | What Does It Mean? | Example Value | Why Is It Important? |
| :--- | :--- | :--- | :--- |
| **Activity** | Name of the Work Breakdown Structure (WBS) task. | `Primary Crusher Foundation` | Identifies the construction or maintenance job. |
| **Cost Code** | Financial accounting control code. | `C-101` | Links physical tasks to accounting ledgers. |
| **Budget** | Approved financial cost cap for this task. | `₱1,500,000` | Baseline budget allocated to the activity. |
| **Committed** | Signed contracts and purchase orders issued. | `₱600,000` | Legally committed funds. |
| **In Transit** | Freight and cargo costs currently travelling. | `₱250,000` | Logistics expenditure allocated to this job. |
| **Installed / Earned** | Value of physically completed, inspected work on site. | `₱400,000` | Earned value representing delivered results. |
| **Total Spend** | *Calculated automatically by the app*: `Committed + In Transit + Installed`. | `₱1,250,000` | Total money already spent or committed. |
| **Variance** | *Calculated automatically by the app*: `Budget - Total Spend`. | `+₱250,000` (Green) / `-₱50,000` (Red) | Positive means under budget; Negative means cost overrun. |
| **Linked Shipment** | The specific cargo shipment tied to this activity. | `Crusher Foundation Anchor Bolts` | Links material delivery delays directly to schedule tasks. |

---

## 7. 📝 Field Reporting Screen

| Field Name in App | What Does It Mean? | Example Value | Why Is It Important? |
| :--- | :--- | :--- | :--- |
| **Date** | Date of daily field inspection or shift report. | `Aug 28, 2026` | Logs daily progress timestamp. |
| **Type** | Category of report: `Progress`, `Incident`, `Delivery`, `Safety`. | `Progress` | Classifies observations for management review. |
| **Description** | Daily notes, ground conditions, progress, or issues. | `Completed rebar tying for Crusher base.` | Captures real-time qualitative site data. |
| **Photos** | Photos captured and uploaded from site. | `[Image 1, Image 2]` | Visual evidence of completed work or site hazards. |

---

## 8. 🛏️ Camp Bed Matrix (Workforce Sub-View & Anti-Hot-Bedding)

| Field Name in App | What Does It Mean? | Example Value | Why Is It Important? |
| :--- | :--- | :--- | :--- |
| **ROOM / BED ID** | Specific physical room and bunk/bed number in the site camp accommodation wing. | `MH-A-01` | Pinpoints physical bed location for room allocation. |
| **CURRENT OCCUPANT** | The worker currently assigned to the bed, or marked `Vacant`. | `Juan Dela Cruz` / `Vacant` | Identifies who is physically sleeping in the bed. |
| **SHIFT ROTATION STATUS** | Operational rotation milestone of the current resident. | `Shift Ending (Leaving Today)`, `Mid-Roster (Active)`, `Maintenance / Cleaning`, `Ready for Assignment` | Clarifies departure timing or preparation state. |
| **VACATING DATE** | Date when the occupant is scheduled to leave site. Extended automatically by **+24h** if outbound convoys are delayed. | `Aug 29, 2026` / `+24h Ext` | Prevents unhousing outbound crew if roads are impassable. |
| **NEXT RESERVED OCCUPANT** | Inbound worker scheduled to take over the bed upon turnover and cleaning. | `Mark Santos (In Transit)` | Coordinates room handover between outbound and inbound crew. |
| **BED STATUS** | Real-time physical availability and turnover state. | `🔴 Occupied`, `🟡 Pending Handover`, `🔵 Housekeeping`, `🟢 Available` | Color-coded status preventing hot-bedding and uncleaned assignments. |
| **Check-In Inbound** | Quick action connecting an incoming worker to the bed and setting status to `🔴 Occupied`. | Action Trigger | Streamlines arrival check-in. |
| **Send to Housekeeping** | Quick action disconnecting a departed worker and setting status to `🔵 Housekeeping`. | Action Trigger | Ensures rooms are routed for sanitization before new arrivals enter. |
| **Sanitation Cleared** | Quick action signing off cleaning inspection and flipping status to `🟢 Available`. | Action Trigger | Marks room clean and ready for immediate booking. |
| **Road Delay Safety Extension** | Automated logic extending vacating date by +24 hours when outbound buses or transport trucks encounter muddy roads/weather. | `+24h Delay Ext` | Protects workers from being evicted while waiting for transit. |

