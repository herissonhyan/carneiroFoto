// FIX: Import React to use React.ReactNode type.
import React from 'react';

export type ScreenType = 'splash' | 'ct' | 'photo';

export interface ResultState {
  type: 'success' | 'error' | 'info';
  message: React.ReactNode;
}