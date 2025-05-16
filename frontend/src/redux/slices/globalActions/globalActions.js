import { createAction } from "@reduxjs/toolkit";

// Correct way to create simple reset actions
export const resetErrAction = createAction("reset/error");
export const resetSuccessAction = createAction("reset/success");
