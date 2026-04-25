# Privacy Policy

Last updated: 2026-04-25

This Privacy Policy explains how Rent Manager, including the web application branded in parts of the interface as The Ledger (the "Service"), collects, uses, stores, and shares information. In this document, "we", "us", and "our" refer to the operator of the Service, and "you" refers to the person or organization using it.

This policy is written to match the current product implementation. It should still be reviewed and finalized with your legal counsel before public launch, especially once your legal entity name, support contact, and deployment jurisdictions are finalized.

## 1. Scope

This Privacy Policy applies to information processed through the Service, including:

- account authentication and sign-in flows;
- tenant-scoped renter, lease, payment, and receipt workflows;
- support or other direct communications with us; and
- temporary developer and testing flows that may be enabled in non-production environments.

This policy does not apply to third-party services that you use separately from the Service, even if they integrate with it.

## 2. Roles and responsibilities

The Service is designed for landlords, property managers, and property teams. In many cases, the person or organization using the Service decides what renter and property information to upload, manage, and store. In that context:

- you are responsible for making sure you have the right to collect, use, and upload personal information about renters, occupants, guarantors, or other individuals; and
- we process that information on your behalf to provide the Service.

If you use the Service to manage information about other people, you are responsible for providing any notices and obtaining any consents required by applicable law.

## 3. Information we collect

### A. Account and authentication information

We may collect:

- name, email address, and user identifier associated with your account;
- authentication provider details, such as whether you signed in with email/password or Google through Supabase authentication;
- password reset and email confirmation workflow data; and
- tenant membership and workspace role information used to enforce access controls.

We do not receive or store your plain-text password in our application code. Authentication is handled through Supabase and related tokens.

### B. Customer content and business records

When you use the Service, we process the information you submit or generate, including:

- renter names;
- apartment numbers and similar property identifiers;
- monthly rent amounts;
- lease dates, deposit amounts, deposit status, and renewal notes;
- payment history, including month paid, amount paid, and date recorded;
- receipt request details and generated receipt files; and
- other information you choose to enter into the Service.

### C. Technical, device, and service usage information

We may automatically process technical information needed to operate, secure, and improve the Service, such as:

- IP address, browser type, device type, operating system, and approximate geolocation inferred from IP;
- timestamps, request metadata, API activity, authentication events, error events, and security logs;
- tenant and user identifiers associated with requests;
- rate-limit and abuse-prevention signals; and
- signed URL and object path metadata related to stored receipts.

### D. Browser storage and session information

The current implementation may store limited temporary data in your browser, including:

- authentication session information managed by Supabase;
- temporary `sessionStorage` values used for development login flows, including a dev token and expiration metadata when dev mode is enabled; and
- temporary UI state such as sign-in flash messages.

We do not currently use the Service to run advertising cookies or third-party behavioral analytics trackers.

### E. Communications

If you contact us, we may keep your name, email address, organization details, and the contents of your communication to respond, troubleshoot, and maintain records.

## 4. How we use information

We use information for the following purposes:

- to create and manage accounts and authenticate users;
- to provide renter, lease, payment, and receipt features;
- to enforce tenant isolation, authorization, and workspace access rules;
- to host, store, retrieve, and generate receipt documents;
- to maintain security, detect abuse, investigate incidents, and enforce our Terms of Service;
- to operate, maintain, debug, and improve the Service;
- to communicate with you about your account, service updates, security notices, and support matters;
- to comply with legal obligations and respond to valid legal requests; and
- to create or maintain development and testing environments when dev-only features are intentionally enabled.

## 5. Legal bases for processing

Depending on your location and applicable law, we rely on one or more of the following legal bases:

- performance of a contract or steps taken at your request before providing the Service;
- legitimate interests in securing, operating, improving, and supporting the Service;
- compliance with legal obligations; and
- your consent, where consent is required.

## 6. How we share information

We do not sell personal information for money. We may share information in the following circumstances:

- with service providers and subprocessors that help us run the Service, such as Supabase for authentication, database infrastructure, and storage;
- with other users in your workspace when access is authorized under your tenant account;
- with professional advisers, auditors, insurers, or financing counterparties under appropriate confidentiality protections;
- when required by law, regulation, court order, or valid legal process;
- when necessary to investigate fraud, security issues, or violations of our terms or policies; and
- in connection with a merger, acquisition, financing, reorganization, or sale of all or part of our business, subject to applicable confidentiality and notice obligations.

## 7. Data retention

We retain information for as long as reasonably necessary for the purposes described in this Privacy Policy, including to provide the Service, maintain security, comply with law, resolve disputes, and enforce agreements.

In general:

- account data is retained while your account remains active and for a reasonable period afterward;
- customer content is retained until deleted by you, your organization, or us in accordance with account closure, legal obligations, backup cycles, or legitimate operational needs;
- generated receipt files may remain stored until deleted under workspace retention or account deletion workflows; and
- temporary dev-session records are intended to expire automatically and currently default to a short retention period in development environments.

We may retain de-identified, aggregated, or log data for longer where permitted by law.

## 8. Security

We use reasonable administrative, technical, and organizational measures designed to protect information. Current security controls include authenticated access, tenant-scoped authorization rules, token validation, and server-side protections such as rate limiting.

No system is completely secure. You are responsible for maintaining the confidentiality of your credentials, using secure devices and networks, and notifying us promptly if you believe your account or data has been compromised.

## 9. International data transfers

The Service may be operated and hosted using providers that process data in multiple countries. By using the Service, you understand that information may be transferred to and processed in jurisdictions other than the one where it was collected, subject to applicable legal safeguards.

## 10. Your choices and rights

Depending on where you live, you or the individuals whose information you submit may have rights to:

- access, correct, or delete personal information;
- object to or restrict certain processing;
- withdraw consent where processing is based on consent;
- request portability of certain information; and
- appeal or complain to a supervisory authority.

Because much of the information in the Service is uploaded and controlled by our customers, requests relating to renter or tenant data may need to be directed first to the workspace owner or property manager who submitted the information.

To protect privacy and security, we may need to verify identity before processing a request.

## 11. Children's privacy

The Service is intended for business and professional use and is not directed to children under 18. We do not knowingly collect personal information directly from children through the Service. If you believe a child has provided information to us inappropriately, contact us so we can review and address the issue.

## 12. Third-party services

The Service relies on third-party infrastructure and authentication providers, including Supabase and Google sign-in when enabled. Those providers may process information under their own privacy terms and policies. Your use of those third-party services may also be subject to separate agreements with them.

## 13. Changes to this Privacy Policy

We may update this Privacy Policy from time to time. If we make a material change, we may provide notice through the Service, by email, or by another reasonable method. The "Last updated" date above indicates when this policy was last revised.

## 14. Contact

For privacy questions or requests, contact the operator of the Service using your designated support channel or the privacy contact published with your deployment of Rent Manager.

Before public release, replace this section with your legal entity name and a monitored privacy contact email or address.
