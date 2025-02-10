"use client";
import React, { useState, Suspense } from "react";
import { LoginButton } from "../login-azure/page";

export default function LoginCard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginButton />
    </Suspense>
  );
}
