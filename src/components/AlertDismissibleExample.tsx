import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AlertDismissibleExample({
  errorMessage,
}: {
  errorMessage: string;
}) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant={'destructive'}>
        {/* <Terminal /> */}
        <AlertTitle>Oh noo! Tiene un error!</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>

      //   <Alert variant='default | destructive' onClose={() => setShow(false)} dismissible>
      //     <Alert.Heading>Oh noo! Tiene un error!</Alert.Heading>
      //     <p> {errorMessage} </p>
      //   </Alert>
    );
  }
  return <></>;
}
