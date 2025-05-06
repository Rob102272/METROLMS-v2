import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles, { colors } from '../styles/globalStyles';
import { userProfile } from '../data/mockData';

export default function ProfileScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/200' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.profileName}>{userProfile.name}</Text>
        <Text style={styles.profileDetail}>{userProfile.program}, {userProfile.year}</Text>
        <Text style={styles.profileDetail}>Student ID: {userProfile.studentId}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.gpa}</Text>
            <Text style={styles.statLabel}>GPA</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.credits.completed}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round((userProfile.credits.completed / userProfile.credits.required) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={16} color={colors.white} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      {/* Academic Information */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Academic Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Program</Text>
          <Text style={styles.infoValue}>{userProfile.program}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Year</Text>
          <Text style={styles.infoValue}>{userProfile.year}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Academic Advisor</Text>
          <Text style={styles.infoValue}>{userProfile.advisor}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Credits Completed</Text>
          <Text style={styles.infoValue}>{userProfile.credits.completed}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Credits In Progress</Text>
          <Text style={styles.infoValue}>{userProfile.credits.inProgress}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Credits Required</Text>
          <Text style={styles.infoValue}>{userProfile.credits.required}</Text>
        </View>
      </View>
      
      {/* Contact Information */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Contact Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userProfile.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{userProfile.contact.phone}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>{userProfile.contact.address}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Emergency Contact</Text>
          <Text style={styles.infoValue}>{userProfile.contact.emergencyContact}</Text>
        </View>
      </View>
      
      {/* Financial Information */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Financial Information</Text>
        
        <View style={styles.financialContainer}>
          <View style={styles.financialHeader}>
            <Text style={styles.financialTitle}>Tuition Summary</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.light,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 20
            }}>
              <Text style={{ color: colors.primary, fontWeight: '500', marginRight: 5 }}>Due {userProfile.financials.tuition.dueDate}</Text>
              <Ionicons name="calendar" size={14} color={colors.primary} />
            </View>
          </View>
          
          <View style={styles.tuitionContainer}>
            <View style={styles.tuitionItem}>
              <Text style={styles.tuitionLabel}>Total</Text>
              <Text style={styles.tuitionValue}>{userProfile.financials.tuition.total}</Text>
            </View>
            <View style={styles.tuitionItem}>
              <Text style={styles.tuitionLabel}>Paid</Text>
              <Text style={[styles.tuitionValue, { color: colors.success }]}>{userProfile.financials.tuition.paid}</Text>
            </View>
            <View style={styles.tuitionItem}>
              <Text style={styles.tuitionLabel}>Balance Due</Text>
              <Text style={[styles.tuitionValue, { color: colors.error }]}>{userProfile.financials.tuition.due}</Text>
            </View>
          </View>
          
          <Text style={[styles.financialTitle, { marginTop: 20 }]}>Scholarships & Financial Aid</Text>
          
          {userProfile.financials.scholarships.map((scholarship, index) => (
            <View key={index} style={styles.scholarshipItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scholarshipName}>{scholarship.name}</Text>
                <View style={{ 
                  paddingVertical: 2, 
                  paddingHorizontal: 10, 
                  backgroundColor: colors.success,
                  borderRadius: 20,
                  alignSelf: 'flex-start',
                  marginTop: 5
                }}>
                  <Text style={{ color: colors.white, fontSize: 12 }}>{scholarship.status}</Text>
                </View>
              </View>
              <Text style={styles.scholarshipAmount}>{scholarship.amount}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={[globalStyles.buttonSecondary, { marginVertical: 20 }]}>
        <Text style={globalStyles.buttonText}>Download Records</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  profileDetail: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.gray,
    opacity: 0.3,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white,
    marginLeft: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    color: colors.gray,
    fontSize: 15,
  },
  infoValue: {
    color: colors.dark,
    fontSize: 15,
    fontWeight: '500',
  },
  financialContainer: {
    marginTop: 10,
  },
  financialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  financialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  tuitionContainer: {
    backgroundColor: colors.lightBg,
    borderRadius: 10,
    padding: 15,
  },
  tuitionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tuitionLabel: {
    color: colors.gray,
  },
  tuitionValue: {
    fontWeight: '600',
    color: colors.dark,
  },
  scholarshipItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scholarshipName: {
    fontSize: 15,
    fontWeight: '500',
  },
  scholarshipAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
