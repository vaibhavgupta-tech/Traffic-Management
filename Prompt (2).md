# Prompt

## Context and Role

Act as a senior full stack developer and cybersecurity engineer.

You are responsible for building a professional Deep Packet Inspection web application. DPI means the system will inspect network packet data  analyze traffic behavior  detect suspicious activity  and show useful security information in a dashboard.

The application should look like a real SOC cybersecurity dashboard used by security analysts. It should be modern  clean  responsive  and suitable for a portfolio  internship project  or final year engineering project.

## Objective

Develop a complete full stack DPI web application.

* Real time packet monitoring means the system should show packet data instantly when new packets are generated or received.  
* Packet analysis dashboard means the system should show useful network statistics using charts  cards  and tables.  
* Threat detection means the system should identify suspicious activity like port scanning  high traffic  or risky IP behavior.  
* Packet filtering means users should be able to filter packet data by IP  protocol  port  date  packet type  and threat status.  
* Search functionality means users should quickly search for packet records  IP addresses  ports  protocols  and alerts.  
* Logs management means packet data should be stored in the database and users should be able to view  delete  and export logs.  
* Secure backend APIs means all backend routes should validate inputs  protect against attacks  and return safe JSON responses.  
* Professional UI means the application should use a dark cybersecurity theme with clean charts  tables  sidebar navigation  and responsive layouts.

## Technology Stack

Use the following technologies.

* React or Next.js should be used for the frontend because it helps create a fast  modern  component based user interface.  
* TypeScript should be used to make the code safer  reduce errors  and define proper types for packets  alerts  users  and API responses.  
* Tailwind CSS should be used for styling  layout  spacing  colors  dark theme  responsive design  cards  buttons  badges  and tables.  
* Recharts or Chart.js should be used to create graphs such as traffic timeline  protocol usage  packet size trends  and alert severity charts.  
* Socket.io Client should be used on the frontend to receive live packet updates from the backend without refreshing the page.  
* Node.js should be used for the backend runtime because it is fast and works well with real time applications.  
* Express.js should be used to create REST APIs for packets  alerts  logs  dashboard analytics  exports  and user activity.  
* Socket.io should be used on the backend to send real time packet data and threat alerts to the frontend.  
* MongoDB or PostgreSQL should be used to store packet logs  threat alerts  user activity  and analytics data.  
* .env should be used to manage environment variables like database URL  server port  JWT secret  and API keys.  
* Helmet should be used to add secure HTTP headers and improve backend security.  
* CORS should be configured properly so only allowed frontend URLs can access the backend APIs.  
* express rate limit should be used to prevent too many API requests from the same user in a short time.  
* Zod or Joi should be used to validate API request data before saving or processing it.  
* Python integration can be added optionally for packet parsing  PCAP analysis  or advanced traffic processing.

---

## Real Time Packet Monitoring Requirements

Create a live packet monitoring page where new packet records appear automatically.

* Source IP address shows where the packet is coming from.  
* Destination IP address shows where the packet is going.  
* Protocol type shows whether the packet uses TCP  UDP  ICMP  HTTP  HTTPS  DNS  or another protocol.  
* Source port shows the port number used by the sender.  
* Destination port shows the port number used by the receiver.  
* Packet size shows the size of the packet in bytes.  
* Packet type shows whether the packet is normal  suspicious  blocked  allowed  or flagged.  
* Timestamp shows the exact date and time when the packet was captured or generated.  
* Threat status shows whether the packet is safe  suspicious  high risk  or critical.

The packet table should include:

* Pagination so large packet logs are divided into pages instead of loading everything at once.  
* Sorting so users can sort packets by time  size  protocol  port  or threat level.  
* Searching so users can quickly find IP addresses  ports  protocols  or packet IDs.  
* Filtering so users can narrow results by IP  protocol  port  date  or threat status.  
* Status badges so safe  suspicious  high risk  and critical packets are easy to identify visually.  
* Responsive design so the table works properly on desktop  tablet  and mobile screens.  
* Smooth real time updates so new packets appear without freezing or slowing the interface.

## Dashboard Requirements

Create a professional analysis dashboard.

* Total packets captured shows the total number of packets processed by the system.  
* Total traffic volume shows the total amount of network data in bytes  KB  MB  or GB.  
* Active connections show how many unique connections are currently active.  
* Protocol usage statistics show how much traffic belongs to TCP  UDP  ICMP  HTTP  HTTPS  DNS  and other protocols.  
* Top source IP addresses show which IP addresses are sending the most traffic.  
* Top destination IP addresses show which IP addresses are receiving the most traffic.  
* Packet activity timeline shows packet activity over time using a line or area chart.  
* Threat alert summary shows the number of low  medium  high  and critical alerts.  
* High risk traffic count shows how many packets are marked as suspicious or dangerous.

Use charts for:

* Network traffic over time to show packet flow minute by minute or hour by hour.  
* Protocol distribution to show which protocols are used most.  
* Packet size trends to show how packet sizes change over time.  
* Alert severity levels to show low  medium  high  and critical threat counts.  
* Most active ports to show which ports are used frequently.  
* Top active IP addresses to identify the most active devices or hosts.

## Threat Detection Requirements

Implement basic threat detection.

* Suspicious IP detection means the system should flag IPs that match risky patterns or appear repeatedly in suspicious traffic.  
* High traffic from a single IP means the system should detect when one IP sends too many packets in a short time.  
* Unusual packet activity means the system should flag traffic that is very different from normal behavior.  
* Port scanning detection means the system should detect when one IP tries to connect to many different ports quickly.  
* Repeated connection attempts means the system should detect repeated requests from the same IP to the same destination.  
* Risky port access means the system should flag traffic using sensitive ports like 22  23  3389  445  or 3306\.  
* Unknown protocol detection means the system should flag packets using unsupported or unusual protocols.

Each threat alert should include:

* Alert title to briefly name the security issue.  
* Alert description to explain what suspicious activity was found.  
* Severity level to show whether the alert is Low  Medium  High  or Critical.  
* Source IP address to identify where the suspicious traffic started.  
* Destination IP address to identify where the suspicious traffic was sent.  
* Detection type to classify the issue  such as Port Scan  High Traffic  or Suspicious IP.  
* Reason for alert to explain why the system marked it as a threat.  
* Timestamp to show when the alert was created.  
* Recommended action to guide the analyst on what to check next.  
* Status to track whether the alert is New  Investigating  or Resolved.

## Packet Filtering Requirements

Allow users to filter packet data.

* Source IP filter helps users view packets coming from a specific IP address.  
* Destination IP filter helps users view packets going to a specific IP address.  
* Protocol filter helps users view only TCP  UDP  HTTP  DNS  ICMP  or other selected protocols.  
* Port number filter helps users find traffic related to a specific port.  
* Packet size range filter helps users find small  medium  or large packets.  
* Packet type filter helps users view normal  suspicious  blocked  allowed  or flagged packets.  
* Threat status filter helps users view safe  suspicious  high risk  or critical packets.  
* Date and time range filter helps users view packets captured during a specific time period.

Filtering should be fast and should update results smoothly without reloading the full page.

## Search Requirements

Add a global search feature.

* Packet ID search helps users find one specific packet record.  
* Source IP search helps users find traffic from a specific sender.  
* Destination IP search helps users find traffic going to a specific receiver.  
* Protocol search helps users find traffic by protocol name.  
* Port search helps users find traffic using a specific network port.  
* Packet type search helps users find normal  suspicious  blocked  or flagged packets.  
* Threat alert search helps users find alerts by title  severity  IP  or detection type.  
* Log record search helps users quickly locate stored packet history.

Search results should be quick  clear  and easy to understand.

## Logs Management Requirements

Store packet logs securely in the database.

* View logs allow users to see historical packet records.  
* Search logs allow users to quickly find specific packet activity.  
* Filter logs allows users to narrow logs by IP  protocol  port  date  or threat level.  
* Delete selected logs allows users to remove specific records.  
* Delete all logs allows admins to clear stored packet history when needed.  
* Export CSV allows users to download logs in spreadsheet format.  
* Export JSON allows users to download logs in developer friendly structured format.

Exported logs should be clean  readable  and useful for reports or further analysis.

## Backend API Requirements

Create secure REST APIs.

* GET /api/packets should return packet logs with pagination.  
* GET /api/packets/search should search packet records by IP  port  protocol  or packet ID.  
* GET /api/packets/filter should return filtered packet data based on selected conditions.  
* DELETE /api/packets/:id should delete one selected packet log.  
* DELETE /api/packets should delete all packet logs  preferably only for admin users.  
* GET /api/alerts should return all threat alerts.  
* PATCH /api/alerts/:id/status should update an alert status to New  Investigating  or Resolved.  
* GET /api/dashboard/stats should return total packets  active connections  traffic volume  and alert counts.  
* GET /api/dashboard/protocols should return protocol usage statistics.  
* GET /api/dashboard/timeline should return packet activity data for charts.  
* GET /api/export/csv should export packet logs in CSV format.  
* GET /api/export/json should export packet logs in JSON format.

All APIs should return structured JSON responses with success  message  data  and error fields.

## Database Requirements

Create database models.

* Packet Logs model should store packet ID  source IP  destination IP  protocol  source port  destination port  packet size  packet type  timestamp  threat detected status  and threat level.  
* Threat Alerts model should store alert ID  title  description  severity  source IP  destination IP  detection type  status  timestamp  and recommended action.  
* User Activity model should store activity ID  action performed  module name  IP address  and timestamp.  
* Analytics Data model should store total packets  protocol statistics  top IP addresses  traffic timeline  and alert summary.

Add database indexes for fields that are searched often  such as source IP  destination IP  protocol  timestamp  port number  and alert severity.

## Security Requirements

The backend must be secure.

* Input sanitization should remove harmful scripts or unwanted characters from user input.  
* API validation should check every request before processing it.  
* XSS protection should prevent malicious scripts from running in the browser.  
* SQL or NoSQL injection protection should stop attackers from manipulating database queries.  
* Helmet should secure HTTP response headers.  
* CORS configuration should allow only trusted frontend URLs.  
* Rate limiting should stop users from sending too many requests quickly.  
* Environment variables should store private values like database URL  API keys  and secret tokens.  
* Structured JSON errors should return clean error messages without exposing server details.  
* Safe error handling should log backend issues but not reveal sensitive information to users.

Do not hard code database credentials  API keys  secret tokens  or environment specific configuration.

## UI Requirements

Design a professional dark cybersecurity dashboard.

* Sidebar navigation should help users move between Dashboard  Packets  Alerts  Logs  Reports  and Settings.  
* Top status bar should show system status  live monitoring status  current time  and active alerts.  
* Dashboard cards should show important numbers such as total packets  active threats  traffic volume  and active connections.  
* Real time packet table should display live packet records in a clean and readable format.  
* Threat alert panel should highlight suspicious or dangerous activities.  
* Interactive charts should visualize traffic  protocols  packet activity  and alerts.  
* Search controls should help users find packets and alerts quickly.  
* Filter controls should help users narrow down traffic data.  
* Export buttons should allow users to download CSV or JSON reports.  
* Log management page should allow users to view  search  delete  and export logs.  
* Responsive layout should work properly on desktop  tablet  and mobile devices.

Use a dark theme with professional colors such as dark navy  charcoal  cyan  green  amber  and red for critical alerts.

## Performance Requirements

Optimize the project for large data.

* Pagination should prevent thousands of packet records from loading at once.  
* Lazy loading should load heavy components only when needed.  
* Efficient chart aggregation should send summarized chart data instead of huge raw datasets.  
* Memoization should prevent unnecessary frontend re rendering.  
* Database indexes should make filtering and searching faster.  
* Controlled Socket.io updates should prevent the UI from lagging during high packet activity.  
* Reduced API calls should avoid repeatedly fetching the same data.  
* Fast search and filtering should make the dashboard feel smooth and professional.

## Optional Advanced Features

Add advanced features if possible.

* User authentication allows only registered users to access the dashboard.  
* Admin dashboard allows admins to manage logs  users  and system settings.  
* Role based access control allows different permissions for admin and analyst users.  
* PCAP file upload allows users to upload packet capture files for analysis.  
* Geo location tracking shows the approximate country or region of IP addresses.  
* AI based anomaly detection helps identify unusual traffic patterns automatically.  
* PDF reports allow users to download professional security reports.  
* Email alerts notify admins when critical threats are detected.  
* Live WebSocket notifications show instant alerts without page refresh.

## Ethical and Legal Requirement

The application must be used only for ethical and authorized cybersecurity monitoring.

* Simulated packet data should be used for demo mode so the project is safe to run.  
* PCAP upload should be used only with packet files collected from authorized networks.  
* Real packet capture should be optional and only allowed in a controlled lab or authorized network.  
* Legal disclaimer should clearly mention that monitoring real networks without permission is not allowed.

## Output Requirements

Provide the complete project.

* Frontend code should include all React or Next.js pages  components  charts  tables  forms  and UI layouts.  
* Backend code should include Express server  APIs  Socket.io logic  security middleware  validation  and database connection.  
* API structure should clearly explain all routes and their purpose.  
* Database schema should define packet logs  alerts  user activity  and analytics models.  
* Folder structure should show how frontend  backend  config  routes  models  controllers  and utilities are organized.  
* Environment variable examples should show required values like server port  database URL  frontend URL  and secret keys.  
* Setup instructions should explain how to install dependencies  configure environment variables  run frontend  run backend  and connect the database.  
* Deployment steps should explain how to deploy the frontend and backend using services like Vercel  Render  Railway  or similar platforms.  
* Security explanation should describe how the project prevents common attacks.  
* Demo packet generator should create realistic sample packet data for testing.  
* README documentation should explain the project clearly for portfolio and interview use.

	

## Final Expected Result

The final project should be a realistic and professional Deep Packet Inspection dashboard.

It should demonstrate full stack development  cybersecurity knowledge  network monitoring concepts  secure backend development  real time communication  database management  and professional UI/UX design.

