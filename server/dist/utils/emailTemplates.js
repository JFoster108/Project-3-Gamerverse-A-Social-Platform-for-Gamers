"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
exports.emailTemplates = {
    postDeleted: (moderatorId, postId) => `
      <h2>Post Deleted</h2>
      <p>Moderator <strong>${moderatorId}</strong> deleted post with ID <strong>${postId}</strong>.</p>
    `,
    postFlagged: (moderatorId, postId, reason) => `
      <h2>Post Flagged</h2>
      <p>Moderator <strong>${moderatorId}</strong> flagged post <strong>${postId}</strong>.</p>
      <p><strong>Reason:</strong> ${reason}</p>
    `,
    appealApproved: (moderatorId, appealId, resolution) => `
      <h2>Appeal Approved</h2>
      <p>Moderator <strong>${moderatorId}</strong> approved appeal <strong>${appealId}</strong>.</p>
      <p><strong>Resolution:</strong> ${resolution}</p>
    `,
    moderationSummary: (actions) => `
      <h2>Daily Moderation Summary</h2>
      ${actions
        .map((action) => `
          <div style="margin-bottom:10px;">
            <p><strong>Action:</strong> ${action.action}</p>
            <p><strong>Moderator:</strong> ${action.moderator_id}</p>
            <p><strong>User Affected:</strong> ${action.user_id || "N/A"}</p>
            <p><strong>Reason:</strong> ${action.reason}</p>
            <p><strong>Date:</strong> ${action.date.toDateString()}</p>
          </div>
        `)
        .join(" ")}
    `,
};
