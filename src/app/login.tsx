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
import loginStyles from '../styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('กรุณากรอก Username');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('กรุณากรอก Password');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (res?.success && res?.user) {
        // Save login state
        if (Platform.OS === 'web') {
          localStorage.setItem('pasu_logged_in', 'true');
          localStorage.setItem('pasu_user', JSON.stringify(res.user));
        }
        router.replace('/');
      } else {
        setErrorMsg(res?.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err: any) {
      // Try to parse error message from API response
      const msg = err?.message || '';
      if (msg.includes('401') || msg.includes('400')) {
        setErrorMsg('Username หรือ Password ไม่ถูกต้อง');
      } else {
        setErrorMsg('ไม่สามารถเชื่อมต่อ Server ได้ กรุณาลองใหม่');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      {/* Top accent bar */}
      <View style={loginStyles.topBar}>
        <Text style={loginStyles.topBarText}>
          ⛏ PASU SHOP — ENTER THE WORLD ⛏
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={loginStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Decorative circles */}
          <View style={loginStyles.decoCircle1} />
          <View style={loginStyles.decoCircle2} />
          <View style={loginStyles.decoCircle3} />

          {/* Brand Logo */}
          <View style={loginStyles.brandContainer}>
            <View style={loginStyles.logoBadge}>
              <Text style={loginStyles.logoText}>PASU</Text>
              <Text style={loginStyles.logoSubText}>SHOP</Text>
            </View>
            <Text style={loginStyles.welcomeText}>WELCOME BACK!</Text>
            <Text style={loginStyles.welcomeSub}>ลงชื่อเข้าใช้เพื่อจัดการสินค้า</Text>
          </View>

          {/* Login Card */}
          <View style={loginStyles.loginCard}>
            <View style={loginStyles.cardHeaderStripe}>
              <Text style={loginStyles.cardHeaderText}>🔐 LOGIN</Text>
            </View>

            <View style={loginStyles.cardBody}>
              {/* Error Message */}
              {errorMsg ? (
                <View style={loginStyles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#ff6b6b" />
                  <Text style={loginStyles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {/* Username */}
              <Text style={loginStyles.fieldLabel}>USERNAME</Text>
              <View style={loginStyles.inputWrapper}>
                <Ionicons name="person" size={18} color="#c8a84e" style={{ marginRight: 8 }} />
                <TextInput
                  style={loginStyles.textInput}
                  placeholder="กรอก Username..."
                  placeholderTextColor="#999999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password */}
              <Text style={loginStyles.fieldLabel}>PASSWORD</Text>
              <View style={loginStyles.inputWrapper}>
                <Ionicons name="lock-closed" size={18} color="#c8a84e" style={{ marginRight: 8 }} />
                <TextInput
                  style={loginStyles.textInput}
                  placeholder="กรอก Password..."
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

              {/* Login Button */}
              <TouchableOpacity
                style={[loginStyles.loginBtn, isLoading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={loginStyles.loginBtnText}>เข้าสู่ระบบ</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={loginStyles.divider}>
                <View style={loginStyles.dividerLine} />
                <Text style={loginStyles.dividerText}>หรือ</Text>
                <View style={loginStyles.dividerLine} />
              </View>

              {/* Register Link */}
              <TouchableOpacity
                style={loginStyles.registerBtn}
                onPress={() => router.push('/register')}
              >
                <Ionicons name="person-add-outline" size={18} color="#c8a84e" style={{ marginRight: 8 }} />
                <Text style={loginStyles.registerBtnText}>สมัครสมาชิกใหม่</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text style={loginStyles.footerText}>
            © 2026 PASU SHOP • ALL RIGHTS RESERVED
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
