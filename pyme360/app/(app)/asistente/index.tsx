import { Bot, Send, Sparkles, User } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { AppText, Card, IconButton, Input, ScreenHeader } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { answerQuestion, SUGGESTED_QUESTIONS } from '@/lib/assistant';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useClientStore } from '@/stores/useClientStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { useSaleStore } from '@/stores/useSaleStore';
import { palette, radius, spacing } from '@/theme';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

export default function AsistenteScreen() {
  const sales = useSaleStore((s) => s.sales);
  const products = useProductStore((s) => s.products);
  const clients = useClientStore((s) => s.clients);
  const orders = useOrderStore((s) => s.orders);
  const business = useBusinessStore((s) => s.business);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hola, soy tu asistente Pyme360. Pregúntame sobre tus ventas, inventario, clientes o utilidad. Solo respondo con datos reales de tu negocio.',
    },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  function ask(question: string) {
    if (!question.trim()) return;
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', text: question };
    const answer = answerQuestion(question, { sales, products, clients, orders, business });
    const botMsg: Message = { id: `b_${Date.now()}`, role: 'bot', text: answer };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Asistente IA" subtitle="Basado en tus datos" />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => (
          <View style={[styles.bubbleRow, item.role === 'user' && styles.bubbleRowUser]}>
            {item.role === 'bot' && (
              <View style={styles.botIcon}>
                <Bot size={16} color={palette.white} />
              </View>
            )}
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
              <AppText variant="body" color={item.role === 'user' ? palette.white : palette.navy900}>
                {item.text}
              </AppText>
            </View>
            {item.role === 'user' && (
              <View style={styles.userIcon}>
                <User size={16} color={palette.navy700} />
              </View>
            )}
          </View>
        )}
        ListFooterComponent={
          messages.length <= 1 ? (
            <View style={{ marginTop: spacing.sm }}>
              <AppText variant="captionMedium" style={{ marginBottom: spacing.xs }}>
                Prueba preguntando:
              </AppText>
              <View style={{ gap: spacing.xs }}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <Pressable key={q} onPress={() => ask(q)}>
                    <Card style={styles.suggestion}>
                      <Sparkles size={14} color={palette.blue600} />
                      <AppText variant="bodyMedium" style={{ marginLeft: spacing.xs, flex: 1 }}>
                        {q}
                      </AppText>
                    </Card>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <Input
            placeholder="Escribe tu pregunta..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => ask(input)}
            containerStyle={{ flex: 1 }}
          />
          <IconButton size={48} bg={palette.blue600} onPress={() => ask(input)}>
            <Send size={18} color={palette.white} />
          </IconButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray50,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  bubbleRowUser: {
    flexDirection: 'row-reverse',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: radius.lg,
    padding: spacing.sm,
  },
  bubbleBot: {
    backgroundColor: palette.white,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: palette.blue600,
    borderBottomRightRadius: 4,
  },
  botIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.navy700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.lg,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
});
