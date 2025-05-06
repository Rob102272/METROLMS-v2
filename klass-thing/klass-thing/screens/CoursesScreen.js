import React from 'react'; 
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import globalStyles, { colors } from '../styles/globalStyles';
import { courses } from '../data/mockData';

export default function CoursesScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <View style={{ marginBottom: 20 }}>
        <Text style={globalStyles.title}>My Courses</Text>
        <Text style={globalStyles.text}>
          Spring Semester 2025 • 5 Courses • 17 Credits
        </Text>
      </View>

      {courses.map(course => (
        <TouchableOpacity key={course.id} style={[globalStyles.card, { marginBottom: 15 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ 
              backgroundColor: colors.primary, 
              padding: 12, 
              borderRadius: 10,
              marginRight: 15
            }}>
              <Text style={{ color: colors.white, fontWeight: 'bold' }}>{course.code}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[globalStyles.subtitle, { marginBottom: 2 }]}>{course.title}</Text>
              <Text style={{ color: colors.gray }}>{course.instructor}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </View>
          
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            marginTop: 15,
            borderTopWidth: 1,
            borderTopColor: '#eee',
            paddingTop: 15
          }}>
            <View>
              <Text style={{ fontWeight: '600' }}>Schedule</Text>
              <Text style={{ color: colors.gray, fontSize: 12 }}>{course.schedule}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: '600' }}>Location</Text>
              <Text style={{ color: colors.gray, fontSize: 12 }}>{course.room}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: '600' }}>Credits</Text>
              <Text style={{ color: colors.gray, fontSize: 12, textAlign: 'center' }}>{course.credits}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={[globalStyles.buttonSecondary, { marginVertical: 20 }]}>
        <Text style={globalStyles.buttonText}>Browse Course Catalog</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
