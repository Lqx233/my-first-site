# Auth Models (Concept)

## Users
- id: UUID
- country_code: e.g. "+86"
- local_number: national number without country prefix
- full_phone_index: E.164 formatted number, unique
- phone_encrypted: AES-GCM encrypted full phone
- phone_hash: SHA256(full_phone_index + salt) for lookup
- status: ACTIVE/DISABLED
- created_at, updated_at

## Roles
- id: UUID
- name: ROLE_CLIENT / ROLE_MERCHANT / ROLE_ADMIN

## UserRoles
- user_id, role_id (unique)

## MerchantProfiles
- id: UUID
- user_id
- merchant_name
- status: PENDING/APPROVED/REJECTED
- invite_code (nullable)

## LoginLogs
- id: UUID
- user_id
- login_channel: GATEWAY/SMS
- client_type: CLIENT_APP/MERCHANT_APP
- ip, device_id, user_agent
- success, failure_reason

## Token Strategy
- Access Token: 15-60 min
- Refresh Token: 7-30 days with rotation

## Security
- Rate limiting on /auth/sms-send by IP+device+phone
- CAPTCHA before SMS send
- KMS-backed encryption for phone_encrypted

## International SMS Routing
- /auth/sms-send requires country_code + local_number
- If country_code is local (e.g. +86), use domestic SMS provider
- Otherwise route to international SMS provider (AWS SNS/Twilio/Alibaba Intl)
