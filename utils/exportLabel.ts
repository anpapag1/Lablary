import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

export interface CaptureRef {
  capture: () => Promise<string>;
}

export async function captureLabel(ref: CaptureRef | null): Promise<string> {
  if (!ref) throw new Error('Canvas ref is not ready');
  return await ref.capture();
}

/**
 * Trigger the native Android Intent Chooser.
 */
export async function shareLabel(uri: string): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('Sharing is not available on this device');
  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle: 'Share Label',
    UTI: 'public.png',
  });
}

/**
 * Save the PNG to the device photo gallery.
 */
export async function saveLabelToGallery(uri: string): Promise<void> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') throw new Error('Permission denied – please allow Gallery access in settings');
  await MediaLibrary.saveToLibraryAsync(uri);
}

/**
 * Send the label PNG to the Android Print Manager.
 */
export async function printLabel(uri: string): Promise<void> {
  const base64 = await readAsStringAsync(uri, {
    encoding: EncodingType.Base64,
  });

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: white;
      }
      img { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>
    <img src="data:image/png;base64,${base64}" />
  </body>
</html>`;

  await Print.printAsync({ html });
}
