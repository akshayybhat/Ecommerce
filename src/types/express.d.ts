import type { User } from "../../generated/prisma/browser.ts";
import express from 'express'
declare module 'express'{
  export interface Request{
    user: User
  }
}