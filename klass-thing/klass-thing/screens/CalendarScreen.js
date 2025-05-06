import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import globalStyles, { colors } from '../styles/globalStyles';
import { calendarEvents } from '../data/mockData';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Generate marked dates for the calendar
  const markedDates = {};
  calendarEvents.forEach(event => {
    if (!markedDates[event.date]) {
      markedDates[event.date] = { 
        marked: true, 
        dotColor: 
          event.type === 'exam' ? colors.error :
          event.type === 'assignment' ? colors.warning :
          event.type === 'class' ? colors.primary :
          colors.accent
      };
    }
    
    // Highlight selected date
    if (event.date === selectedDate) {
      markedDates[event.date] = {
        ...markedDates[event.date],
        selected: true,
        selectedColor: colors.primary,
      };
    }
  });
  
  // If selected date is not already marked, mark it as selected
  if (!markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.primary,
    };
  }
  
  // Get events for selected date
  const selectedDateEvents = calendarEvents.filter(event => event.date === selectedDate);
  
  // Get event icon
  const getEventIcon = (type) => {
    switch (type) {
      case 'class':
        return 'school';
      case 'exam':
        return 'document-text';
      case 'assignment':
        return 'create';
      case 'study':
        return 'book';
      case 'meeting':
        return 'people';
      case 'event':
        return 'calendar';
      default:
        return 'calendar';
    }
  };
  
  // Get event color
  const getEventColor = (type) => {
    switch (type) {
      case 'class':
        return colors.primary;
      case 'exam':
        return colors.error;
      case 'assignment':
        return colors.warning;
      case 'study':
        return colors.success;
      case 'meeting':
        return colors.accent;
      case 'event':
        return colors.secondary;
      default:
        return colors.gray;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.lightBg }}>
      <View style={{ backgroundColor: colors.white, padding: 15 }}>
        <Text style={globalStyles.title}>Academic Calendar</Text>
        
        {/* Calendar component */}
        <Calendar
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            calendarBackground: colors.white,
            textSectionTitleColor: colors.dark,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: colors.white,
            todayTextColor: colors.primary,
            dayTextColor: colors.dark,
            textDisabledColor: colors.gray,
            dotColor: colors.primary,
            selectedDotColor: colors.white,
            arrowColor: colors.primary,
            monthTextColor: colors.dark,
            indicatorColor: colors.primary,
          }}
        />
      </View>
      
      <ScrollView style={[globalStyles.container, { paddingTop: 15 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <Text style={globalStyles.subtitle}>
            Events for {new Date(selectedDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric'
            })}
          </Text>
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons name="add-circle" size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, marginLeft: 5 }}>Add Event</Text>
          </TouchableOpacity>
        </View>
        
        {selectedDateEvents.length > 0 ? (
          selectedDateEvents.map((event, index) => (
            <TouchableOpacity 
              key={event.id} 
              style={[
                globalStyles.card, 
                { marginBottom: 10, borderLeftWidth: 5, borderLeftColor: getEventColor(event.type) }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: getEventColor(event.type), 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginRight: 15
                }}>
                  <Ionicons name={getEventIcon(event.type)} size={20} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{event.title}</Text>
                  <Text style={{ color: colors.gray }}>
                    {event.startTime} - {event.endTime} • {event.location}
                  </Text>
                </View>
                <Ionicons name="ellipsis-vertical" size={20} color={colors.gray} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ 
            padding: 30, 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: colors.white,
            borderRadius: 10
          }}>
            <Ionicons name="calendar" size={60} color={colors.gray} />
            <Text style={{ fontSize: 18, marginTop: 15, textAlign: 'center' }}>
              No events scheduled for this date
            </Text>
          </View>
        )}
        
        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <Text style={globalStyles.subtitle}>Upcoming Deadlines</Text>
        </View>
        
        {calendarEvents
          .filter(event => new Date(event.date) > new Date() && 
            (event.type === 'assignment' || event.type === 'exam'))
          .slice(0, 3)
          .map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={[
                globalStyles.card, 
                { marginBottom: 10, borderLeftWidth: 5, borderLeftColor: getEventColor(event.type) }
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: getEventColor(event.type), 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginRight: 15
                }}>
                  <Ionicons name={getEventIcon(event.type)} size={20} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{event.title}</Text>
                  <Text style={{ color: colors.gray }}>
                    Due on {new Date(event.date).toLocaleDateString()} at {event.startTime}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.gray} />
              </View>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </View>
  );
}