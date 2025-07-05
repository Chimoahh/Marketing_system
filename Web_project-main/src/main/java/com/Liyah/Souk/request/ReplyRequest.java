package com.Liyah.Souk.request;

public class ReplyRequest {
    private String adminReply;
    private String adminName;

    public ReplyRequest() {}

    public ReplyRequest(String adminReply, String adminName) {
        this.adminReply = adminReply;
        this.adminName = adminName;
    }

    public String getAdminReply() {
        return adminReply;
    }

    public void setAdminReply(String adminReply) {
        this.adminReply = adminReply;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }
} 