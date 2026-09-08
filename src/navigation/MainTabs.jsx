import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabBar from '../components/TabBar';
import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CameraScreen from '../screens/CameraScreen';
import MomentComposerScreen from '../screens/MomentComposerScreen';
import CafeDetailScreen from '../screens/CafeDetailScreen';
import PlusSheet from '../components/coffee/PlusSheet';
import { Sheet } from '../components/coffee/Kit';
import NotificationsPanel from '../components/coffee/NotificationsPanel';
import PeopleSearchPanel from '../components/coffee/PeopleSearchPanel';
import UserProfileScreen from '../screens/UserProfileScreen';
import { CoffeePreviewProvider } from '../context/CoffeePreviewContext';
import { useAuth } from '../context/AuthContext';
import { coffee as c } from '../theme/coffee';

const screens = { home: HomeScreen, shop: ShopScreen, profile: ProfileScreen };

export default function MainTabs() {
  const { user } = useAuth();
  return <CoffeePreviewProvider key={user?.uid || 'preview'}><Tabs /></CoffeePreviewProvider>;
}
function Tabs() {
  const [activeTab, setActiveTab] = useState('home');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [momentComposerOpen, setMomentComposerOpen] = useState(false);
  const [cafe, setCafe] = useState(null);
  const [plus, setPlus] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [person, setPerson] = useState(null);
  const shared = {
    onCamera: () => setCameraOpen(true), onMoment: () => setMomentComposerOpen(true), onCafe: setCafe,
    onPlus: () => setPlus('user'), onPartner: () => setPlus('cafe'),
    onExplore: () => setActiveTab('shop'), onNotifications: () => setNotifications(true),
    onSearch: () => setSearchOpen(true), onProfile: setPerson,
  };
  const ActiveScreen = screens[activeTab] || HomeScreen;
  return <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
    <ActiveScreen {...shared} />
    <TabBar activeTab={activeTab} onChangeTab={setActiveTab} onOpenCamera={shared.onCamera} />
    <Modal visible={cameraOpen} animationType="slide" onRequestClose={() => setCameraOpen(false)}>
      <View style={s.modalBackdrop}><View style={s.modalFrame}>{cameraOpen && <CameraScreen onClose={() => setCameraOpen(false)} />}</View></View>
    </Modal>
    <Modal visible={momentComposerOpen} animationType="slide" onRequestClose={() => setMomentComposerOpen(false)}>
      <View style={s.modalBackdrop}><View style={s.modalFrame}>{momentComposerOpen && <MomentComposerScreen onClose={() => setMomentComposerOpen(false)} />}</View></View>
    </Modal>
    <Modal visible={!!cafe} animationType="slide" onRequestClose={() => setCafe(null)}>
      <View style={s.modalBackdrop}><View style={s.modalFrame}>{cafe && <CafeDetailScreen key={cafe.id} cafe={cafe} onClose={() => setCafe(null)} />}</View></View>
    </Modal>
    <Modal visible={!!person} animationType="slide" onRequestClose={() => setPerson(null)}>
      <View style={s.modalBackdrop}><View style={s.modalFrame}>{person && <UserProfileScreen key={person.uid} initialProfile={person} onClose={() => setPerson(null)} />}</View></View>
    </Modal>
    <PlusSheet visible={!!plus} partner={plus === 'cafe'} onClose={() => setPlus(null)} />
    <Sheet visible={notifications} onClose={() => setNotifications(false)} title="الإشعارات">
      <NotificationsPanel />
    </Sheet>
    <Sheet visible={searchOpen} onClose={() => setSearchOpen(false)} title="البحث عن الأشخاص">
      <PeopleSearchPanel onOpen={(profile) => { setSearchOpen(false); setPerson(profile); }} />
    </Sheet>
  </SafeAreaView>;
}
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  modalBackdrop: { flex: 1, backgroundColor: '#E5E0D9', alignItems: 'center' },
  modalFrame: { flex: 1, width: '100%', maxWidth: 480 },
});
