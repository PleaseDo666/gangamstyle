import React from 'react';
import {
  HomepageCard as Card,
  HomepageSection as Section,
} from '../HomepageComponents';

export default function EcosystemSection({ title, className }) {
  return (
    <Section title={title} className={className}>
      <Card
        title="Tools & Integrations"
        description="Check out "
        to="/ToolsAndExamples/SDKExamples/EncryptAndDecrypt/setup" //linked to Tools section, second pass to include Tools and Integrations broken out
      />
      <Card
        title="Grants"
        description="Looking to extend what you're already building with Lit? Apply for a grant!"
        to="/litGrants"
      />

      <Card
        title="Community"
        description="Join the community through Discord, Twitter, and keep up to date with the community calendar."
        to="/Introduction/whatIsLitProtocol#join-the-community"
      />
    </Section>
  );
}

/** TODO: Add in this section once Tools and Integrations have their separate landing spots
 *    <Card
        title="Integrations"
        description="Integration SDKs to make building easier"
        to="/guides/integrating-with-webhooks"
      />
 */
