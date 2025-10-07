import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Ticket Item Component 
const TicketItem = ({ ticket, onEdit, onDelete, onRate }) => {
  // Function to assign a color to each ticket status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Created':
        return '#3B82F6'; // Blue
      case 'Under Assistance':
        return '#EAB308'; // Yellow
      case 'Completed':
        return '#22C55E'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  // Rating stars (displayed only when ticket is "Completed")
  const RatingStars = () => (
    <View style={styles.ratingStarsContainer}>
      <Text style={styles.ratingLabel}>Rate this ticket:</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onRate(ticket.id, star)}>
            <FontAwesome
              name={ticket.rating && ticket.rating >= star ? 'star' : 'star-o'}
              size={32}
              color="#f59e0b"
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.ticketCard}>
      {/* Ticket Header */}
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{ticket.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(ticket.status) },
          ]}
        >
          <Text style={styles.statusText}>{ticket.status}</Text>
        </View>
      </View>

      {/* Ticket Description */}
      <Text style={styles.ticketDescription}>{ticket.description}</Text>

      {/* Rating stars appear if ticket is completed */}
      {ticket.status === 'Completed' && <RatingStars />}

      {/* Edit & Delete Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(ticket)}>
          <Text style={styles.buttonText}>✏ Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(ticket.id)}>
          <Text style={styles.buttonText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//Main App Component
export default function App() {
  // Ticket state (list of all tickets)
  const [tickets, setTickets] = useState([
    {
      id: '1',
      title: 'Mobile Dev',
      description: 'Students develop apps using react native',
      status: 'Created',
      rating: null,
    },
    {
      id: '2',
      title: 'Web technology',
      description: 'In collaboration with mobile dev, and also uses angular',
      status: 'Under Assistance',
      rating: null,
    },
    {
      id: '3',
      title: 'Software engineering',
      description: 'A subject which is a prerequisite for programming',
      status: 'Completed',
      rating: 4,
    },
  ]);

  // States for Modal and form
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState('Created');

  // FUNCTIONS
  // Add new ticket
  const handleAddTicket = () => {
    setEditingTicket(null);
    setFormTitle('');
    setFormDescription('');
    setFormStatus('Created');
    setModalVisible(true);
  };

  // Edit existing ticket
  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormTitle(ticket.title);
    setFormDescription(ticket.description);
    setFormStatus(ticket.status);
    setModalVisible(true);
  };

  // Save or update ticket
  const handleSaveTicket = () => {
    if (!formTitle.trim()) return Alert.alert('Error', 'Please enter a ticket title.');
    if (!formDescription.trim()) return Alert.alert('Error', 'Please enter a description.');

    if (editingTicket) {
      // Update ticket
      setTickets((prev) =>
        prev.map((t) =>
          t.id === editingTicket.id
            ? { ...t, title: formTitle, description: formDescription, status: formStatus }
            : t
        )
      );
    } else {
      // Add new ticket
      const newTicket = {
        id: Date.now().toString(),
        title: formTitle,
        description: formDescription,
        status: formStatus,
        rating: null,
      };
      setTickets((prev) => [...prev, newTicket]);
    }

    setModalVisible(false);
  };

  // Delete ticket
  const handleDelete = (id: string) => {
    Alert.alert('Delete Ticket', 'Are you sure you want to delete this ticket?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setTickets((prev) => prev.filter((t) => t.id !== id)),
      },
    ]);
  };

  // Handle rating stars click
  const handleRate = (ticketId, rating) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, rating } : t))
    );
  };

  //RENDER
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Ticket Tracker</Text>
      </View>

      {/* Ticket List */}
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TicketItem ticket={item} onEdit={handleEdit} onDelete={handleDelete} onRate={handleRate} />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Ticket Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTicket}>
        <Text style={styles.addButtonText}>+ Add New Ticket</Text>
      </TouchableOpacity>

      {/* Modal for Add/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingTicket ? 'Edit Ticket' : 'Add New Ticket'}
            </Text>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Title */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ticket title"
              value={formTitle}
              onChangeText={setFormTitle}
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter ticket description"
              value={formDescription}
              onChangeText={setFormDescription}
              multiline
              numberOfLines={4}
            />

            {/* Status */}
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={formStatus} onValueChange={setFormStatus} style={styles.picker}>
                <Picker.Item label="Created" value="Created" />
                <Picker.Item label="Under Assistance" value="Under Assistance" />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTicket}>
                <Text style={styles.saveButtonText}>
                  {editingTicket ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

//Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#6366f1', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  listContent: { padding: 16, paddingBottom: 80 },

  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ticketTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', flex: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 12, fontWeight: '600' },
  ticketDescription: { fontSize: 14, color: '#6b7280', marginBottom: 12 },

  actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  editButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 14 },

  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  modalContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  modalHeader: { backgroundColor: '#6366f1', padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  modalContent: { flex: 1, padding: 20 },

  label: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: { height: 50 },
  modalButtons: { marginTop: 30 },
  saveButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#6b7280',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  // Rating Styles
  ratingStarsContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  stars: { flexDirection: 'row', justifyContent: 'center' },
  starIcon: { marginHorizontal: 4 },
});