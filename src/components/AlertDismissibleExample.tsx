import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AlertDismissibleExample({
  errorMessage,
}: {
  errorMessage: string;
}) {
  const [show] = useState(true);

  if (show) {
    return (
      <Alert variant={'destructive'}>
        {/* <Terminal /> */}
        <AlertTitle>Oh noo! Tiene un error!</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }
  return <></>;
}
