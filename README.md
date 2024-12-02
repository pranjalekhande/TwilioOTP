npm install mocha chai chai-http --save-dev



curl -X POST http://localhost:5001/api/request-otp \
-H "Content-Type: application/json" \
-d '{"phone": "+919403466290"}'


curl -X POST http://localhost:5001/api/register \
-H "Content-Type: application/json" \
-d '{"phone": "+919403466290"}'



curl -X POST http://localhost:5001/api/validate-otp \
-H "Content-Type: application/json" \
-d '{"phone": "+919403466290", "otp": "348857"}'



Phase 5: Notifications and Reminders
Features to Implement:
Email Notifications for Invitations: Notify invitees when they receive an invitation.
Event Reminder System: Send reminders (e.g., 24 hours before the event) to invitees who RSVP’d "Accepted."
Real-Time RSVP Updates (Optional): Use WebSockets (e.g., Socket.io) to notify organizers of RSVP changes in real-time.