import React from 'react'; 
import { View, Text, Image, Pressable, ScrollView, FlatList, SectionList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const danhMuc = [
  { id: '1', title: 'Công việc', icon: 'briefcase-outline' as const, count: '4 việc', color: '#2563eb' },
  { id: '2', title: 'Học tập', icon: 'book-outline' as const, count: '2 bài', color: '#7c3aed' },
  { id: '3', title: 'Cá nhân', icon: 'person-outline' as const, count: '3 việc', color: '#059669' },
  { id: '4', title: 'Dự án', icon: 'folder-outline' as const, count: '1 mục', color: '#d97706' },
];

const congViec = [
  {
    title: 'Cần làm hôm nay',
    data: [
      { id: 't1', name: 'Thiết kế giao diện Task App', time: '14:00', priority: 'Cao', done: false },
      { id: 't2', name: 'Nộp bài tập QTM', time: '17:00', priority: 'Gấp', done: true },
    ],
  },
  {
    title: 'Kế hoạch sắp tới',
    data: [
      { id: 't3', name: 'Học lý thuyết React Native', time: 'Ngày mai', priority: 'Trung bình', done: false },
      { id: 't4', name: 'Họp nhóm', time: 'Thứ 6', priority: 'Bình thường', done: false },
    ],
  },
  {
    title: 'Đã hoàn thành gần đây',
    data: [
      { id: 't5', name: 'Cài đặt môi trường SDK 54 IOS', time: 'Hôm qua', priority: 'Xong', done: true },
    ],
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={require('../../assets/images/icon.png')} style={styles.avatar} />
          <View>
            <Text style={styles.headerGreeting}>Xin chào,</Text>
            <Text style={styles.headerName}>Huy Hoàng</Text>
          </View>
        </View>
        <Pressable style={styles.headerButton} onPress={() => Alert.alert('Thông báo', 'Không có thông báo mới')}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <View>
              <Text style={styles.statsLabel}>Tổng quan công việc</Text>
              <Text style={styles.statsTitle}>Hoàn thành 50%</Text>
            </View>
            <MaterialCommunityIcons name="chart-donut" size={36} color="#fff" />
          </View>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarActive} />
          </View>
          <View style={styles.statsFooter}>
            <Text style={styles.statsSubtext}>1 / 2 việc hôm nay đã xong</Text>
            <Pressable style={styles.statsActionButton} onPress={() => Alert.alert('Thao tác', 'Mở form tạo mới')}>
              <Feather name="plus" size={16} color="#2563eb" />
              <Text style={styles.statsActionText}>Thêm việc</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Danh mục</Text>
          <Pressable onPress={() => Alert.alert('Danh mục', 'Xem tất cả')}>
            <Text style={styles.seeAllText}>Tất cả</Text>
          </Pressable>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={danhMuc}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <Pressable style={styles.categoryCard} onPress={() => Alert.alert('Danh mục', item.title)}>
              <View style={[styles.iconWrapper, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.categoryName}>{item.title}</Text>
              <Text style={styles.categoryCount}>{item.count}</Text>
            </Pressable>
          )}
        />

        <Text style={[styles.sectionHeading, { marginTop: 24, marginBottom: 8 }]}>Nhiệm vụ theo lịch</Text>

        <SectionList
          scrollEnabled={false}
          sections={congViec}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.groupHeaderText}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Pressable
                style={[styles.checkbox, item.done && styles.checkboxDone]}
                onPress={() => Alert.alert('Trạng thái', `Đổi trạng thái: ${item.name}`)}
              >
                {item.done && <Ionicons name="checkmark" size={14} color="#fff" />}
              </Pressable>
              <View style={styles.taskBody}>
                <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>{item.name}</Text>
                <View style={styles.taskMetaRow}>
                  <View style={styles.timeTag}>
                    <Feather name="clock" size={13} color="#666" />
                    <Text style={styles.taskTimeText}>{item.time}</Text>
                  </View>
                  <View style={styles.priorityTag}>
                    <Text style={styles.priorityText}>{item.priority}</Text>
                  </View>
                </View>
              </View>
              <Pressable onPress={() => Alert.alert('Tùy chọn', item.name)}>
                <Feather name="more-vertical" size={18} color="#999" />
              </Pressable>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { //tránh vùng tai thỏ
    flex: 1,
    backgroundColor: '#fff',
    padding:10,
  },
  scrollContainer: { // Khung ngoài
    paddingHorizontal: 10,
    flex: 1,
  },
  scrollContent: { // Nội dung bên trong
    paddingHorizontal: 16,
    paddingBottom: 50, 
  },

  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  userInfo: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: { 
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerGreeting: { 
    fontSize: 14,
    color: '#666',
  },
  headerName: { 
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButton: { // chuông
    padding: 8,
  },

  statsCard: { // Thẻ chính
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginVertical: 16,
  },
  statsHeader: { // Hàng thông tin
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
  },
  statsLabel: { // Chữ phụ
    fontSize: 14,
    color: '#666',
  },
  statsTitle: { // Tiêu đề chính
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  progressBarBackground: { // thanh tiến độ
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginVertical: 12,
  },
  progressBarActive: { // Vạch tiến độ
    width: '50%',
    height: '100%',
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  statsFooter: { // Đáy thẻ
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsSubtext: { // Chữ tiến độ
    fontSize: 14,
    color: '#555',
  },
  statsActionButton: { // Nút thêm
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  statsActionText: { // Chữ nút thêm
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  sectionHeaderRow: { // Hàng tiêu đề
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  sectionHeading: { // Tiêu đề mục
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: { // Nút xem thêm
    fontSize: 15,
    color: 'blue',
    fontWeight: '600',
  },

  categoryList: { // Danh sách danh mục
    gap: 12,
    paddingVertical: 4,
  },
  categoryCard: { // Thẻ danh mục
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    width: 95,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconWrapper: { // Khung icon
    marginBottom: 6,
  },
  categoryName: { // Tên danh mục
    fontSize: 15,
    fontWeight: '600',
  },
  categoryCount: { // Số lượng việc
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

  groupHeaderText: { // Tiêu đề nhóm
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    marginTop: 16,
    marginBottom: 8,
  },
  taskCard: { // Thẻ nhiệm vụ
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  checkbox: { // Ô chọn
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: { // Ô chọn xong
    backgroundColor: 'green',
    borderColor: 'green',
  },
  taskBody: { // Thân nhiệm vụ
    flex: 1,
  },
  taskTitle: { // Tên nhiệm vụ
    fontSize: 16,
    fontWeight: '600',
  },
  taskTitleDone: { // Tên nhiệm vụ xong
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  taskMetaRow: { // Hàng thông tin phụ
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  timeTag: { // Thẻ thời gian
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskTimeText: { // Chữ thời gian
    fontSize: 13,
    color: '#666',
  },
  priorityTag: { // Thẻ ưu tiên
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  priorityText: { // Chữ ưu tiên
    fontSize: 12,
    color: '#555',
  },
  moreButton: { // Nút tùy chọn
    padding: 6,
  },
});