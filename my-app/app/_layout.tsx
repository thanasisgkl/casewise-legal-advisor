import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import MainLayout from '../components/MainLayout';
import { ToastProvider } from '../components/ui/Toast';

export default function RootLayout() {
  return (
    <ToastProvider>
      <MainLayout>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'CaseWise',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="new-case"
            options={{
              title: 'Νέα Υπόθεση',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="history"
            options={{
              title: 'Ιστορικό Υποθέσεων',
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="case/[id]"
            options={{
              title: 'Λεπτομέρειες Υπόθεσης',
              presentation: 'card',
            }}
          />
        </Stack>
      </MainLayout>
    </ToastProvider>
  );
}
