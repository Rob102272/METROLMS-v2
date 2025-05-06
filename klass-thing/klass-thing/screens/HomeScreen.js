import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles, { colors } from '../styles/globalStyles';
import { assignments, courses, calendarEvents, userProfile } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  // Get upcoming assignments
  const upcomingAssignments = assignments
    .filter(item => item.status === 'Upcoming')
    .slice(0, 3);
  
  // Get today's events
  const today = new Date().toISOString().split('T')[0];
  const todaysEvents = calendarEvents
    .filter(event => event.date === today)
    .slice(0, 3);

  return (
    <ScrollView style={globalStyles.container}>
      <View style={{ marginBottom: 20 }}>
        <Text style={globalStyles.title}>Welcome back, {userProfile.name}!</Text>
        <Text style={globalStyles.text}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Progress Summary */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Your Academic Progress</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primary }}>
              {userProfile.gpa}
            </Text>
            <Text>Current GPA</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primary }}>
              {userProfile.credits.completed}
            </Text>
            <Text>Credits Completed</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primary }}>
              {Math.round((userProfile.credits.completed / userProfile.credits.required) * 100)}%
            </Text>
            <Text>Program Completion</Text>
          </View>
        </View>
        
        {/* View Grades Button - Now navigates to GradesScreen */}
        <TouchableOpacity 
          style={styles.viewGradesButton}
          onPress={() => navigation.navigate('Grades')}
        >
          <Ionicons name="school-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.viewGradesButtonText}>View Grades</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Assignments */}
      <View style={globalStyles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={globalStyles.subtitle}>Upcoming Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Assignments')}>
            <Text style={{ color: colors.primary }}>View All</Text>
          </TouchableOpacity>
        </View>

        {upcomingAssignments.map(item => {
          const course = courses.find(c => c.id === item.courseId);
          return (
            <TouchableOpacity 
              key={item.id} 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#eee'
              }}
              onPress={() => navigation.navigate('Assignments', { filter: item.id })}
            >
              <View style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20, 
                backgroundColor: colors.accent, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginRight: 15
              }}>
                <Ionicons 
                  name={
                    item.type === 'Exam' ? 'document-text' :
                    item.type === 'Project' ? 'construct' :
                    item.type === 'Assignment' ? 'create' : 'book'
                  } 
                  size={20} 
                  color="white" 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: colors.gray, fontSize: 12 }}>
                  {course.code} • Due {new Date(item.dueDate).toLocaleDateString()} • {item.totalPoints} points
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>
          );
        })}

        {upcomingAssignments.length === 0 && (
          <Text style={{ textAlign: 'center', padding: 20, color: colors.gray }}>
            No upcoming assignments!
          </Text>
        )}
      </View>

      {/* Today's Schedule */}
      <View style={globalStyles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={globalStyles.subtitle}>Today's Schedule</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Text style={{ color: colors.primary }}>Full Calendar</Text>
          </TouchableOpacity>
        </View>

        {todaysEvents.map(event => (
          <TouchableOpacity
            key={event.id} 
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#eee'
            }}
            onPress={() => navigation.navigate('Calendar', { date: today, eventId: event.id })}
          >
            <View style={{ 
              width: 4, 
              height: 40, 
              backgroundColor: 
                event.type === 'class' ? colors.primary :
                event.type === 'exam' ? colors.error :
                event.type === 'assignment' ? colors.warning :
                colors.success,
              marginRight: 15,
              borderRadius: 2
            }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{event.title}</Text>
              <Text style={{ color: colors.gray, fontSize: 12 }}>
                {event.startTime} - {event.endTime} • {event.location}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
        ))}

        {todaysEvents.length === 0 && (
          <Text style={{ textAlign: 'center', padding: 20, color: colors.gray }}>
            No events scheduled for today!
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewGradesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  viewGradesButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});