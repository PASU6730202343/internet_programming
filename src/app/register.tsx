import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiCall } from '@/services/api';
import registerStyles from '../styles/register.styles';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('กรุณากรอก Username');
      return;
    }
    if (username.trim().length < 3) {
      setErrorMsg('Username ต้องมีอย่างน้อย 3 ตัวอักษร');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('กรุณากรอก Password');
      return;
    }
    if (password.trim().length < 4) {
      setErrorMsg('Password ต้องมีอย่างน้อย 4 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password ไม่ตรงกัน กรุณากรอกใหม่');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiCall('/register', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          display_name: displayName.trim() || username.trim(),
          email: email.trim(),
        }),
      });

      if (res?.success) {
        setSuccessMsg('สมัครสมาชิกสำเร็จ! กำลังไปหน้า Login...');
        setTimeout(() => {
          router.replace('/login');
        }, 1500);
      } else {
        setErrorMsg(res?.error || 'สมัครสมาชิกไม่สำเร็จ');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('409')) {
        setErrorMsg('Username นี้ถูกใช้แล้ว กรุณาเลือก Username อื่น');
      } else {
        setErrorMsg('ไม่สามารถเชื่อมต่อ Server ได้ กรุณาลองใหม่');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={registerStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0a06" />

      {/* Top accent bar */}
      <View style={registerStyles.topBar}>
        <Text style={registerStyles.topBarText}>
          ⛏ PASU SHOP — CREATE NEW PLAYER ⛏
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={registerStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Decorative circles */}
          <View style={registerStyles.decoCircle1} />
          <View style={registerStyles.decoCircle2} />

          {/* Brand Logo */}
          <View style={registerStyles.brandContainer}>
            <View style={registerStyles.logoBadge}>
              <Text style={registerStyles.logoText}>PASU</Text>
              <Text style={registerStyles.logoSubText}>SHOP</Text>
            </View>
            <Text style={registerStyles.welcomeText}>CREATE ACCOUNT</Text>
            <Text style={registerStyles.welcomeSub}>สมัครสมาชิกเพื่อเข้าใช้งาน</Text>
          </View>

          {/* Register Card */}
          <View style={registerStyles.registerCard}>
            <View style={registerStyles.cardHeaderStripe}>
              <Text style={registerStyles.cardHeaderText}>📝 REGISTER</Text>
            </View>

            <View style={registerStyles.cardBody}>
              {/* Error Message */}
              {errorMsg ? (
                <View style={registerStyles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#ff6b6b" />
                  <Text style={registerStyles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {/* Success Message */}
              {successMsg ? (
                <View style={registerStyles.successBox}>
                  <Ionicons name="checkmark-circle" size={18} color="#7fff00" />
                  <Text style={registerStyles.successText}>{successMsg}</Text>
                </View>
              ) : null}

              {/* Username */}
              <Text style={registerStyles.fieldLabel}>USERNAME *</Text>
              <View style={registerStyles.inputWrapper}>
                <Ionicons name="person" size={18} color="#4aedd9" style={{ marginRight: 8 }} />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="ตั้ง Username (อย่างน้อย 3 ตัว)..."
                  placeholderTextColor="#999999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Display Name */}
              <Text style={registerStyles.fieldLabel}>ชื่อที่แสดง</Text>
              <View style={registerStyles.inputWrapper}>
                <Ionicons name="text" size={18} color="#4aedd9" style={{ marginRight: 8 }} />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="ชื่อที่ต้องการแสดง (ไม่บังคับ)..."
                  placeholderTextColor="#999999"
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>

              {/* Email */}
              <Text style={registerStyles.fieldLabel}>EMAIL</Text>
              <View style={registerStyles.inputWrapper}>
                <Ionicons name="mail" size={18} color="#4aedd9" style={{ marginRight: 8 }} />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="อีเมล (ไม่บังคับ)..."
                  placeholderTextColor="#999999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <Text style={registerStyles.fieldLabel}>PASSWORD *</Text>
              <View style={registerStyles.inputWrapper}>
                <Ionicons name="lock-closed" size={18} color="#4aedd9" style={{ marginRight: 8 }} />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="ตั้ง Password (อย่างน้อย 4 ตัว)..."
                  placeholderTextColor="#999999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666666"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={registerStyles.fieldLabel}>ยืนยัน PASSWORD *</Text>
              <View style={registerStyles.inputWrapper}>
                <Ionicons name="lock-closed" size={18} color="#4aedd9" style={{ marginRight: 8 }} />
                <TextInput
                  style={registerStyles.textInput}
                  placeholder="กรอก Password อีกครั้ง..."
                  placeholderTextColor="#999999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[registerStyles.registerBtn, isLoading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={isLoading || !!successMsg}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={registerStyles.registerBtnText}>สมัครสมาชิก</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={registerStyles.divider}>
                <View style={registerStyles.dividerLine} />
                <Text style={registerStyles.dividerText}>หรือ</Text>
                <View style={registerStyles.dividerLine} />
              </View>

              {/* Back to Login */}
              <TouchableOpacity
                style={registerStyles.loginLinkBtn}
                onPress={() => router.replace('/login')}
              >
                <Ionicons name="log-in-outline" size={18} color="#c8a84e" style={{ marginRight: 8 }} />
                <Text style={registerStyles.loginLinkText}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text style={registerStyles.footerText}>
            © 2026 PASU SHOP • ALL RIGHTS RESERVED
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
