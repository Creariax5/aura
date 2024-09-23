import type { TabsContentProps } from 'tamagui'
import { Text, H5, Separator, SizableText, Tabs, XStack, YStack, isWeb } from 'tamagui'
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Profile from '../../components/profile';
import Friends from '../../components/friends';
import { Link } from 'expo-router';


export default function TabLayout() {
  return (
    <Tabs
      backgroundColor="$background"
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      width="100%"
      height="100%"
      overflow="hidden"
    >
      <YStack flex={1}>
        <TabsContent value="tab1">
          <Profile />
        </TabsContent>

        <TabsContent value="tab2">
          <Friends />
        </TabsContent>

        <TabsContent value="tab3">
          <YStack flex={1} padding="$4" paddingTop="$10" space="$4">
            <H5>Other</H5>
            <Link
              href="https://elc-145223486.hubspotpagebuilder.eu/le-blog/politique-de-confidentialitée"
              asChild
            >
              <Text
                fontSize="$6"
                fontWeight="bold"
                color="$blue10"
                hoverStyle={{ textDecorationLine: 'underline' }}
                cursor="pointer"
                marginTop="$2"
              >
                Politique de confidentialité
              </Text>
            </Link>
          </YStack>
        </TabsContent>
      </YStack>

      <Separator />

      <Tabs.List
        separator={<Separator vertical />}
        disablePassBorderRadius="top"
        aria-label="Manage your account"
      >
        <Tabs.Tab flex={1} value="tab1">
          <SizableText fontFamily="$body">Profile</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2">
          <SizableText fontFamily="$body">Connections</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab3">
          <SizableText fontFamily="$body">Other</SizableText>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      flexDirection="column"
      width="100%"
      height="100%"
      overflow="hidden"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}