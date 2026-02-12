// services/email.service.ts

import { SendBulkEmail, SendEmail } from "@/types/send-email.types";
import api from "./api";

/** =====================
 * Email Service
 * ===================== */

const emailService = {
  /** =====================
   * SEND SINGLE EMAIL
   * ===================== */
  sendEmail: async (data: SendEmail): Promise<void> => {
    await api.post("/email/send", data);
  },

  /** =====================
   * SEND BULK EMAIL
   * ===================== */
  sendBulkEmail: async (data: SendBulkEmail): Promise<void> => {
    await api.post("/email/bulk", data);
  },
};

export default emailService;
