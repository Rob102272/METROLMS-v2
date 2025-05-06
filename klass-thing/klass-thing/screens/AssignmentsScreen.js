import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Modal,
  Pressable,
  Image,
  FlatList,
  Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import globalStyles, { colors } from '../styles/globalStyles';
import { assignments, courses } from '../data/mockData';

export default function AssignmentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const filteredAssignments =
    activeTab === 'all' ? assignments :
    assignments.filter(item =>
      activeTab === 'upcoming' ? item.status === 'Upcoming' :
      activeTab === 'missing' ? item.status === 'Missing' :
      activeTab === 'completed' ? item.status === 'Completed' : true
    );

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'missing', label: 'Missing' },
    { id: 'completed', label: 'Completed' },
  ];

  const getAssignmentIcon = (type) => {
    switch (type) {
      case 'Exam': return 'document-text';
      case 'Project': return 'construct';
      case 'Assignment': return 'create';
      case 'Lab': return 'flask';
      case 'Essay': return 'book';
      default: return 'document';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return colors.success;
      case 'Upcoming': return colors.warning;
      case 'Missing': return colors.accent;
      default: return colors.gray;
    }
  };

  const openAssignmentDetail = (assignment) => {
    setSelectedAssignment(assignment);
    setDetailModalVisible(true);
  };

  const closeAssignmentDetail = () => {
    setDetailModalVisible(false);
    setSelectedAssignment(null);
  };

  const formatDate = (dateString) => {
    // Make sure we have a valid date
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date not available";
      }
      const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Date not available";
    }
  };

  const renderAttachment = ({ item }) => {
    const getFileIcon = (fileType) => {
      switch (fileType) {
        case 'pdf': return 'file-pdf-box';
        case 'doc':
        case 'docx': return 'file-word-box';
        case 'ppt':
        case 'pptx': return 'file-powerpoint-box';
        case 'xls':
        case 'xlsx': return 'file-excel-box';
        case 'jpg':
        case 'jpeg':
        case 'png': return 'file-image-box';
        default: return 'file-box';
      }
    };

    return (
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          padding: 12,
          borderRadius: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: '#E2E8F0'
        }}
        onPress={() => Linking.openURL(item.url)}
      >
        <MaterialCommunityIcons 
          name={getFileIcon(item.type)} 
          size={24} 
          color="#4158F6" 
        />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontWeight: '500', color: '#1E293B' }}>{item.name}</Text>
          <Text style={{ color: '#64748B', fontSize: 12 }}>{item.size}</Text>
        </View>
        <Ionicons name="download-outline" size={20} color="#64748B" />
      </TouchableOpacity>
    );
  };

  const AssignmentDetailModal = () => {
    if (!selectedAssignment) return null;
    
    const course = courses.find(c => c.id === selectedAssignment.courseId);
    
    // Mock attachments for the assignment
    const attachments = [
      { id: 1, name: 'Assignment Instructions.pdf', type: 'pdf', size: '420 KB', url: 'https://example.com/file1.pdf' },
      { id: 2, name: 'Reference Material.docx', type: 'docx', size: '215 KB', url: 'https://example.com/file2.docx' },
      { id: 3, name: 'Sample Submission.jpg', type: 'jpg', size: '1.2 MB', url: 'https://example.com/file3.jpg' },
    ];

    // Calculate posted date safely - one week before due date
    const getPostedDate = () => {
      try {
        const dueDate = new Date(selectedAssignment.dueDate);
        if (isNaN(dueDate.getTime())) {
          return new Date(); // Fallback to current date if due date is invalid
        }
        const postedDate = new Date(dueDate);
        postedDate.setDate(postedDate.getDate() - 7); // 7 days before due date
        return postedDate;
      } catch (error) {
        console.error("Error calculating posted date:", error);
        return new Date(); // Fallback to current date
      }
    };

    // Get submission date safely
    const getSubmittedDate = () => {
      if (selectedAssignment.submittedDate) {
        try {
          const date = new Date(selectedAssignment.submittedDate);
          if (!isNaN(date.getTime())) {
            return date;
          }
        } catch (error) {
          console.error("Invalid submitted date:", error);
        }
      }
      return new Date(); // Fallback to current date
    };

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={detailModalVisible}
        onRequestClose={closeAssignmentDetail}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.lightBg }}>
          <StatusBar barStyle="light-content" />
          
          {/* Header */}
          <View style={{
            backgroundColor: '#4158F6',
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <TouchableOpacity onPress={closeAssignmentDetail}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', flex: 1, marginLeft: 16 }}>
              Assignment Details
            </Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }}>
            {/* Assignment Header */}
            <View style={{ 
              backgroundColor: 'white',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#E2E8F0'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#4158F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 15
                }}>
                  <Ionicons name={getAssignmentIcon(selectedAssignment.type)} size={24} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 22, color: '#1E293B' }}>
                    {selectedAssignment.title}
                  </Text>
                  <Text style={{ color: '#64748B', fontSize: 16 }}>
                    {course.code} - {course.title}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getStatusColor(selectedAssignment.status),
                  marginRight: 5
                }} />
                <Text style={{ color: getStatusColor(selectedAssignment.status), fontSize: 15 }}>
                  {selectedAssignment.status}
                </Text>
              </View>
              
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: '#E2E8F0'
              }}>
                <View>
                  <Text style={{ fontWeight: '600', color: '#64748B', fontSize: 13 }}>Posted</Text>
                  <Text style={{ color: '#1E293B', fontSize: 15, marginTop: 4 }}>
                    {formatDate(selectedAssignment.postedDate || getPostedDate())}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontWeight: '600', color: '#64748B', fontSize: 13 }}>Due</Text>
                  <Text style={{ color: '#1E293B', fontSize: 15, marginTop: 4 }}>
                    {formatDate(selectedAssignment.dueDate)}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontWeight: '600', color: '#64748B', fontSize: 13 }}>Points</Text>
                  <Text style={{ color: '#1E293B', fontSize: 15, marginTop: 4 }}>
                    {selectedAssignment.totalPoints}
                  </Text>
                </View>
              </View>
            </View>

            {/* Assignment Instructions */}
            <View style={{ backgroundColor: 'white', padding: 20, marginTop: 12 }}>
              <Text style={{ fontWeight: '600', fontSize: 18, color: '#1E293B', marginBottom: 12 }}>
                Instructions
              </Text>
              <Text style={{ color: '#64748B', lineHeight: 22, fontSize: 16 }}>
                {selectedAssignment.description}
              </Text>
              
              {/* Example of additional instructions - would come from the actual assignment data */}
              <Text style={{ color: '#64748B', lineHeight: 22, fontSize: 16, marginTop: 12 }}>
                Please submit your work following the formatting guidelines discussed in class. 
                Remember to reference all sources used according to the appropriate citation style.
              </Text>
            </View>

            {/* Attachments Section */}
            <View style={{ backgroundColor: 'white', padding: 20, marginTop: 12 }}>
              <Text style={{ fontWeight: '600', fontSize: 18, color: '#1E293B', marginBottom: 12 }}>
                Materials
              </Text>
              <FlatList
                data={attachments}
                renderItem={renderAttachment}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
              />
            </View>

            {/* Your Work Section */}
            <View style={{ backgroundColor: 'white', padding: 20, marginTop: 12, marginBottom: 20 }}>
              <Text style={{ fontWeight: '600', fontSize: 18, color: '#1E293B', marginBottom: 12 }}>
                Your Work
              </Text>
              
              {selectedAssignment.status === 'Completed' ? (
                <View>
                  <View style={{ 
                    backgroundColor: '#F0FDF4', 
                    padding: 16, 
                    borderRadius: 8, 
                    borderLeftWidth: 4, 
                    borderLeftColor: colors.success,
                    marginBottom: 16
                  }}>
                    <Text style={{ fontWeight: 'bold', color: colors.success }}>Submitted</Text>
                    <Text style={{ color: '#064E3B', marginTop: 4 }}>
                      {formatDate(getSubmittedDate())}
                    </Text>
                  </View>
                  
                  <View style={{
                    backgroundColor: colors.lightBg,
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 16
                  }}>
                    <Text style={{ fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>Score</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                        {selectedAssignment.score}
                      </Text>
                      <Text style={{ fontSize: 24, color: '#64748B' }}>
                        /{selectedAssignment.totalPoints}
                      </Text>
                      <Text style={{ 
                        marginLeft: 8, 
                        fontWeight: '500', 
                        color: selectedAssignment.score / selectedAssignment.totalPoints >= 0.7 ? colors.success : colors.warning 
                      }}>
                        ({Math.round((selectedAssignment.score / selectedAssignment.totalPoints) * 100)}%)
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={{
                    backgroundColor: '#4158F6',
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>View Your Submission</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={{ 
                    backgroundColor: selectedAssignment.status === 'In Progress' ? '#FEF3C7' : '#F1F5F9', 
                    padding: 16, 
                    borderRadius: 8, 
                    borderLeftWidth: 4, 
                    borderLeftColor: selectedAssignment.status === 'In Progress' ? colors.warning : '#CBD5E1',
                    marginBottom: 16
                  }}>
                    <Text style={{ 
                      fontWeight: 'bold', 
                      color: selectedAssignment.status === 'In Progress' ? '#92400E' : '#475569' 
                    }}>
                      {selectedAssignment.status === 'In Progress' ? 'Started' : 'Not Started'}
                    </Text>
                    {selectedAssignment.status === 'In Progress' && (
                      <Text style={{ color: '#92400E', marginTop: 4 }}>
                        Draft saved on {formatDate(new Date())}
                      </Text>
                    )}
                  </View>
                  
                  <TouchableOpacity style={{
                    backgroundColor: '#4158F6',
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginBottom: 12
                  }}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>
                      {selectedAssignment.status === 'In Progress' ? 'Continue Working' : 'Start Assignment'}
                    </Text>
                  </TouchableOpacity>
                  
                  {selectedAssignment.status === 'Upcoming' && (
                    <TouchableOpacity style={{
                      backgroundColor: 'transparent',
                      paddingVertical: 14,
                      borderRadius: 8,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#CBD5E1'
                    }}>
                      <Text style={{ color: '#475569', fontWeight: '500' }}>Mark as Done</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.lightBg }}>
      <StatusBar barStyle="light-content" />
      
      {/* Assignment Detail Modal */}
      <AssignmentDetailModal />
      
      {/* Tabs */}
      <View style={{
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
            height: 50,
          }}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={{
                paddingHorizontal: 20,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
              }}
              onPress={() => setActiveTab(tab.id)}
            >
              <View style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: activeTab === tab.id ? '#4158F6' : 'transparent',
                borderRadius: 50,
              }}>
                <Text style={{
                  fontSize: 14,
                  color: activeTab === tab.id ? colors.white : '#555',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                }}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {filteredAssignments.map(item => {
            const course = courses.find(c => c.id === item.courseId);
            const dueDate = new Date(item.dueDate);
            const today = new Date();
            const isOverdue = item.status !== 'Completed' && dueDate < today;
            
            return (
              <TouchableOpacity 
                key={item.id} 
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                onPress={() => openAssignmentDetail(item)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#4158F6',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 15
                  }}>
                    <Ionicons name={getAssignmentIcon(item.type)} size={24} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#1E293B' }}>{item.title}</Text>
                    <Text style={{ color: '#64748B', fontSize: 14 }}>
                      {course.code} - {course.title}
                    </Text>
                  </View>
                  {isOverdue && (
                    <View style={{
                      backgroundColor: '#FEE2E2',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 20,
                      marginLeft: 4
                    }}>
                      <Text style={{ color: '#B91C1C', fontSize: 12, fontWeight: '500' }}>Overdue</Text>
                    </View>
                  )}
                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#EEF2F6',
                  paddingTop: 12
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#64748B', fontSize: 13 }}>Type</Text>
                    <Text style={{ color: '#1E293B', fontSize: 15, marginTop: 4 }}>{item.type}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#64748B', fontSize: 13 }}>Due Date</Text>
                    <Text style={{ 
                      color: isOverdue ? '#DC2626' : '#1E293B', 
                      fontSize: 15, 
                      marginTop: 4,
                      fontWeight: isOverdue ? '600' : 'normal'
                    }}>
                      {formatDate(item.dueDate).split(',')[0]} {/* Only display date without time */}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#64748B', fontSize: 13 }}>Points</Text>
                    <Text style={{ color: '#1E293B', fontSize: 15, marginTop: 4 }}>{item.totalPoints}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#64748B', fontSize: 13 }}>Status</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: getStatusColor(item.status),
                        marginRight: 5
                      }} />
                      <Text style={{ color: getStatusColor(item.status), fontSize: 15 }}>{item.status}</Text>
                    </View>
                  </View>
                </View>

                {item.score !== undefined && (
                  <View style={{
                    backgroundColor: colors.lightBg,
                    marginTop: 12,
                    padding: 10,
                    borderRadius: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{ color: '#64748B' }}>Your Score:</Text>
                    <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>
                      {item.score}/{item.totalPoints} ({Math.round((item.score / item.totalPoints) * 100)}%)
                    </Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={{
                    backgroundColor: '#4158F6',
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: 16
                  }}
                  onPress={() => openAssignmentDetail(item)}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>
                    {item.status === 'Completed' ? 'View Submission' : 'View Details'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          {filteredAssignments.length === 0 && (
            <View style={{
              padding: 30,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.white,
              borderRadius: 12,
              marginVertical: 20,
              height: 200,
            }}>
              <Ionicons name="checkmark-circle" size={60} color="#A0AEC0" />
              <Text style={{ fontSize: 18, marginTop: 16, textAlign: 'center', color: '#64748B' }}>
                No {activeTab !== 'all' ? activeTab : ''} assignments found!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}