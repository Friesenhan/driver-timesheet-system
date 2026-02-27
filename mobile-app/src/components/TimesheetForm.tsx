import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { submitTimesheet } from '../services/api';

export default function TimesheetForm() {
  const [code, setCode] = useState('');
  const [startingKm, setStartingKm] = useState('');
  const [endingKm, setEndingKm] = useState('');
  const [shiftStart, setShiftStart] = useState('');
  const [loadOut, setLoadOut] = useState('');
  const [firstStop, setFirstStop] = useState('');
  const [lastStop, setLastStop] = useState('');
  const [lastReattempt, setLastReattempt] = useState('');
  const [stationReturn, setStationReturn] = useState('');
  const [clockOut, setClockOut] = useState('');
  const [zone, setZone] = useState('');
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [uta, setUta] = useState('');
  const [utl, setUtl] = useState('');
  const [nsl, setNsl] = useState('');
  const [bc, setBc] = useState('');
  const [rejDmg, setRejDmg] = useState('');
  const [oodt, setOodt] = useState('');
  const [fdd, setFdd] = useState('');
  const [extra, setExtra] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter your driver code');
      return;
    }

    setLoading(true);

    try {
      const result = await submitTimesheet({
        code: code.trim().toUpperCase(),
        startingKm: startingKm.trim() || undefined,
        endingKm: endingKm.trim() || undefined,
        shiftStart: shiftStart.trim() || undefined,
        loadOut: loadOut.trim() || undefined,
        firstStop: firstStop.trim() || undefined,
        lastStop: lastStop.trim() || undefined,
        lastReattempt: lastReattempt.trim() || undefined,
        stationReturn: stationReturn.trim() || undefined,
        clockOut: clockOut.trim() || undefined,
        zone: zone.trim() || undefined,
        uta: uta.trim() || undefined,
        utl: utl.trim() || undefined,
        nsl: nsl.trim() || undefined,
        bc: bc.trim() || undefined,
        rejDmg: rejDmg.trim() || undefined,
        oodt: oodt.trim() || undefined,
        fdd: fdd.trim() || undefined,
        extra: extra.trim() || undefined,
      });

      if (result.success) {
        Alert.alert('Success', 'Your timesheet has been submitted!', [
          {
            text: 'OK',
            onPress: () => {
              // Clear all fields
              setCode('');
              setStartingKm('');
              setEndingKm('');
              setShiftStart('');
              setLoadOut('');
              setFirstStop('');
              setLastStop('');
              setLastReattempt('');
              setStationReturn('');
              setClockOut('');
              setZone('');
              setUta('');
              setUtl('');
              setNsl('');
              setBc('');
              setRejDmg('');
              setOodt('');
              setFdd('');
              setExtra('');
            },
          },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to submit timesheet');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
  style={styles.container} 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
>
  <ScrollView 
    style={styles.container}
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={true}
  >
        <View style={styles.form}>
          <Text style={styles.label}>Driver Code *</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="e.g., CX11"
            autoCapitalize="characters"
            editable={!loading}
          />

          <Text style={styles.label}>Starting KM</Text>
          <TextInput
            style={styles.input}
            value={startingKm}
            onChangeText={setStartingKm}
            placeholder="e.g., 55478"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Ending KM</Text>
          <TextInput
            style={styles.input}
            value={endingKm}
            onChangeText={setEndingKm}
            placeholder="e.g., 55857"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Shift Start (24hr, e.g., 0815)</Text>
          <TextInput
            style={styles.input}
            value={shiftStart}
            onChangeText={setShiftStart}
            placeholder="hhmm"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Load Out (24hr)</Text>
          <TextInput
            style={styles.input}
            value={loadOut}
            onChangeText={setLoadOut}
            placeholder="hhmm"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>First Stop (24hr)</Text>
          <TextInput
            style={styles.input}
            value={firstStop}
            onChangeText={setFirstStop}
            placeholder="hhmm"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Last Stop (24hr)</Text>
          <TextInput
            style={styles.input}
            value={lastStop}
            onChangeText={setLastStop}
            placeholder="hhmm"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Last Reattempt (24hr)</Text>
          <TextInput
            style={styles.input}
            value={lastReattempt}
            onChangeText={setLastReattempt}
            placeholder="hhmm"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Station Return (24hr)</Text>
          <TextInput
            style={styles.input}
            value={stationReturn}
            onChangeText={setStationReturn}
            placeholder="hhmm"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Clock Out (24hr)</Text>
          <TextInput
            style={styles.input}
            value={clockOut}
            onChangeText={setClockOut}
            placeholder="hhmm"
            keyboardType="numeric"
            editable={!loading}
          />

  <Text style={styles.label}>Zone</Text>
<TouchableOpacity
  style={styles.pickerButton}
  onPress={() => {
    setShowZonePicker(true);
  }}
>
  <Text style={[styles.pickerText, !zone && styles.pickerPlaceholder]}>
    {zone || 'Select Zone'}
  </Text>
</TouchableOpacity>

{/* Zone Picker Modal */}
{showZonePicker && (
  <View style={styles.modalOverlay} pointerEvents="box-none">
    <TouchableOpacity 
      style={styles.modalBackdrop}
      activeOpacity={1}
      onPress={() => setShowZonePicker(false)}
    >
      <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
        <Text style={styles.modalTitle}>Select Zone</Text>
        <ScrollView 
     style={styles.modalScrollView}
     nestedScrollEnabled={true}
     showsVerticalScrollIndicator={true}
   >
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Campbell River');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Campbell River</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Black Creek');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Black Creek</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Comox');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Comox</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Courtenay');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Courtenay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Cumberland');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Cumberland</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Royston/Union Bay');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Royston/Union Bay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Fanny Bay/Bowser');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Fanny Bay/Bowser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Port Alberni');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Port Alberni</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Qualicum Beach');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Qualicum Beach</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Errington');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Errington</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Parksville');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Parksville</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Nanoose Bay');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Nanoose Bay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Lantzville');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Lantzville</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Nanaimo');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Nanaimo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Cedar');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Cedar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Ladysmith');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Ladysmith</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoneOption}
            onPress={() => {
              setZone('Chemainus');
              setShowZonePicker(false);
            }}
          >
            <Text style={styles.zoneOptionText}>Chemainus</Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity
          style={styles.modalCloseButton}
          onPress={() => setShowZonePicker(false)}
        >
          <Text style={styles.modalCloseText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </View>
)}
          <Text style={styles.label}>UTA</Text>
          <TextInput
            style={styles.input}
            value={uta}
            onChangeText={setUta}
            placeholder=""
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>UTL</Text>
          <TextInput
            style={styles.input}
            value={utl}
            onChangeText={setUtl}
            placeholder=""
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>NSL</Text>
          <TextInput
            style={styles.input}
            value={nsl}
            onChangeText={setNsl}
            placeholder=""
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>BC</Text>
          <TextInput
            style={styles.input}
            value={bc}
            onChangeText={setBc}
            placeholder=""
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Rej/Dmg</Text>
          <TextInput
            style={styles.input}
            value={rejDmg}
            onChangeText={setRejDmg}
            placeholder=""
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>OODT</Text>
          <TextInput
            style={styles.input}
            value={oodt}
            onChangeText={setOodt}
            placeholder=""
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>FDD</Text>
          <TextInput
            style={styles.input}
            value={fdd}
            onChangeText={setFdd}
            placeholder=""
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Extra</Text>
          <TextInput
            style={styles.input}
            value={extra}
            onChangeText={setExtra}
            placeholder=""
            keyboardType="numeric"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Timesheet</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 15,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 4,
  },
  pickerText: {
    fontSize: 15,
    color: '#333',
  },
  pickerPlaceholder: {
    color: '#999',
  },
 modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  elevation: 9999,
},
modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 300,
    width: '100%',
  },
  zoneOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  zoneOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 150,
    flexGrow: 1,
  },
});