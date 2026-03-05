import { useFonts as useExpoFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Raleway_400Regular, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Oswald_400Regular, Oswald_700Bold } from '@expo-google-fonts/oswald';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { CourierPrime_400Regular } from '@expo-google-fonts/courier-prime';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';

export function useAppFonts() {
  const [fontsLoaded, fontError] = useExpoFonts({
    Inter_400Regular, Inter_700Bold,
    Roboto_400Regular, Roboto_700Bold,
    Montserrat_400Regular, Montserrat_700Bold,
    Nunito_400Regular, Nunito_700Bold,
    Raleway_400Regular, Raleway_700Bold,
    Lato_400Regular, Lato_700Bold,
    Oswald_400Regular, Oswald_700Bold,
    PlayfairDisplay_400Regular, PlayfairDisplay_700Bold,
    CourierPrime_400Regular,
    Pacifico_400Regular,
  });
  return { fontsLoaded, fontError };
}
