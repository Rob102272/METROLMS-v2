import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles, { colors } from '../styles/globalStyles';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [locationAccess, setLocationAccess] = useState(false);

  const settingsSections = [
    {
      title: 'General',
      settings: [
        {
          icon: 'notifications',
          title: 'Push Notifications',
          description: 'Receive notifications for assignments, exams, and announcements',
          toggle: true,
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'moon',
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          toggle: true,
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'mail',
          title: 'Email Updates',
          description: 'Receive email updates about your courses',
          toggle: true,
          value: emailUpdates,
          onValueChange: setEmailUpdates,
        },
        {
          icon: 'volume-high',
          title: 'Sound Effects',
          description: 'Play sounds for notifications and interactions',
          toggle: true,
          value: soundEffects,
          onValueChange: setSoundEffects,
        },
        {
          icon: 'location',
          title: 'Location Access',
          description: 'Allow access to your location for campus features',
          toggle: true,
          value: locationAccess,
          onValueChange: setLocationAccess,
        },
      ],
    },
    {
      title: 'Account',
      settings: [
        {
          icon: 'lock-closed',
          title: 'Change Password',
          description: 'Update your account password',
          chevron: true,
          onPress: () => Alert.alert('Change Password', 'Password change functionality would go here'),
        },
        {
          icon: 'person',
          title: 'Privacy Settings',
          description: 'Manage what information is shared with others',
          chevron: true,
          onPress: () => Alert.alert('Privacy Settings', 'Privacy settings would go here'),
        },
        {
          icon: 'shield-checkmark',
          title: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          chevron: true,
          onPress: () => Alert.alert('Two-Factor Authentication', '2FA setup would go here'),
        },
        {
          icon: 'language',
          title: 'Language',
          description: 'Change your preferred language',
          value: 'English',
          chevron: true,
          onPress: () => Alert.alert('Language Settings', 'Language options would go here'),
        },
      ],
    },
    {
      title: 'Support',
      settings: [
        {
          icon: 'help-circle',
          title: 'Help Center',
          description: 'Get help with using the app',
          chevron: true,
          onPress: () => Alert.alert('Help Center', 'Help resources would go here'),
        },
        {
          icon: 'chatbubble-ellipses',
          title: 'Contact Support',
          description: 'Reach out to our support team',
          chevron: true,
          onPress: () => Alert.alert('Contact Support', 'Support contact options would go here'),
        },
        {
          icon: 'bug',
          title: 'Report a Problem',
          description: 'Let us know if something isn\'t working correctly',
          chevron: true,
          onPress: () => Alert.alert('Report a Problem', 'Problem reporting form would go here'),
        },
        {
          icon: 'star',
          title: 'Rate the App',
          description: 'Tell us what you think about the app',
          chevron: true,
          onPress: () => Alert.alert('Rate the App', 'App rating functionality would go here'),
        },
      ],
    },
    {
      title: 'About',
      settings: [
        {
          icon: 'information-circle',
          title: 'App Information',
          description: 'Version 1.0.0',
          chevron: true,
          onPress: () => Alert.alert('App Information', 'Detailed app information would go here'),
        },
        {
          icon: 'document-text',
          title: 'Terms of Service',
          description: 'Review our terms of service',
          chevron: true,
          onPress: () => Alert.alert('Terms of Service', 'Terms of service document would go here'),
        },
        {
          icon: 'shield',
          title: 'Privacy Policy',
          description: 'Review our privacy policy',
          chevron: true,
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy document would go here'),
        },
      ],
    },
  ];

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>
      <Text style={[globalStyles.text, { marginBottom: 20 }]}>
        Customize your app experience
      </Text>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={{ marginBottom: 20 }}>
          <Text style={[globalStyles.subtitle, { marginBottom: 10, marginLeft: 5 }]}>
            {section.title}
          </Text>

          <View style={[globalStyles.card, { padding: 0, overflow: 'hidden' }]}>
            {section.settings.map((setting, settingIndex) => (
              <TouchableOpacity
                key={settingIndex}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  borderBottomWidth: settingIndex < section.settings.length - 1 ? 1 : 0,
                  borderBottomColor: '#eee',
                }}
                onPress={setting.onPress}
                disabled={!setting.onPress}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.light,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 15,
                }}>
                  <Ionicons name={setting.icon} size={22} color={colors.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 3 }}>
                    {setting.title}
                  </Text>
                  <Text style={{ color: colors.gray, fontSize: 13 }}>
                    {setting.description}
                  </Text>
                </View>

                {setting.value && !setting.toggle && (
                  <Text style={{ marginRight: 10, color: colors.gray }}>
                    {setting.value}
                  </Text>
                )}

                {setting.toggle ? (
                  <Switch
                    trackColor={{ false: '#d1d1d1', true: colors.accent }}
                    thumbColor={setting.value ? colors.primary : '#f4f3f4'}
                    ios_backgroundColor="#d1d1d1"
                    onValueChange={setting.onValueChange}
                    value={setting.value}
                  />
                ) : setting.chevron ? (
                  <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[globalStyles.buttonPrimary, { backgroundColor: colors.error, marginTop: 10, marginBottom: 30 }]}
        onPress={() => Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Sign Out',
              style: 'destructive',
              onPress: () => Alert.alert('Signed Out', 'You have been signed out'),
            },
          ]
        )}
      >
        <Text style={globalStyles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
