import React from 'react';
import AssetClient from '../../components/AssetClient';
import { HomepageCryptoProvider } from '../../components/HomepageCryptoProvider';

export default function AssetPage() {
  return (
    <HomepageCryptoProvider>
      <AssetClient />
    </HomepageCryptoProvider>
  );
}