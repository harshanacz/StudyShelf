import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppImages } from '@/constants/app-images';
import { useForm } from '@/hooks/use-form';
import { login } from '@/store/auth-slice';
import { useAppDispatch } from '@/store/hooks';
import { loginSchema } from '@/utils/validation-schemas';
import { useRouter } from 'expo-router';
import { Alert, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm<LoginFormValues>({
      initialValues: {
        username: '',
        password: '',
      },
      validationSchema: loginSchema,
      onSubmit: (formValues) => {
        // Dummy authentication
        const trimmedUsername = formValues.username.trim();
        const trimmedPassword = formValues.password.trim();

        if (trimmedUsername === 'harshana' && trimmedPassword === 'pass123') {
          dispatch(login(trimmedUsername));
          router.replace('/(tabs)');
        } else {
          Alert.alert(
            'Login Failed',
            'Invalid username or password\n\nDemo credentials:\nUsername: harshana\nPassword: pass123'
          );
        }
      },
    });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.formContainer}>
        <Image source={AppImages.shelbyHi} style={styles.logo} resizeMode="contain" />
        <ThemedText type="title" style={styles.title}>StudyShelf</ThemedText>
        <ThemedText style={styles.subtitle}>Login to your account</ThemedText>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Username</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={values.username}
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
          />
          {touched.username && errors.username ? (
            <ThemedText style={styles.errorText}>{errors.username}</ThemedText>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
          />
          {touched.password && errors.password ? (
            <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={styles.buttonText}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <ThemedText style={styles.linkText}>
            Don't have an account? Register
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#007AFF',
  },
});
