'use client'
import Image from "next/image";
import styles from "./page.module.css";
import type { AppProps } from 'next/app';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import {DefaultFileUploaderExample} from './file-uploader';
import { DefaultStorageImageExample } from "./display-images";

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className={styles.page}>
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol>
            <li>
              Get started by editing <code>src/app/page.tsx</code>.
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>
          <h1>Hello {user?.username}</h1>
          <DefaultFileUploaderExample/>
          <DefaultStorageImageExample/>
          <button onClick={signOut}>Sign out</button>
          {/* <Component {...pageProps} /> */}
        </main>
      </div>
      )}
    </Authenticator>
  );
};