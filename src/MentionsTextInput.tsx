import GraphemeSplitter from 'grapheme-splitter';
import * as React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import shortid from 'shortid';
import { showInvisibles } from 'eslint-plugin-prettier';

const styles = StyleSheet.create({
  mention: {
    lineHeight: 24,
    backgroundColor: '#ffff0099',
  },
});

type MentionRange = {
  offset: number,
  length: number,
  id: string,
  key: string,
};

type Mentionable = {
  id: string,
  text: string,
};

type Props = {
  initialMentionRanges: Array<MentionRange>,
  initialValue: string,
  mentionables: Array<Mentionable>,
};

type State = {
  mentionRanges: Array<MentionRange>,
  showMentionables: boolean,
  value: string,
};

class MentionsTextInput extends React.Component<Props, State> {
  insertMentionAt: number | null = null;

  constructor(props: Props) {
    super(props);

    const { initialValue, initialMentionRanges } = props;

    this.state = {
      mentionRanges: initialMentionRanges,
      showMentionables: false,
      value: initialValue,
    };
  }

  onChangeText = (value: string) => {
    this.setState({
      value,
    });
  };

  onSelectionChange = (event) => {
    const { start, end } = event.nativeEvent.selection;
    const { value } = this.state;
    if (start === end && value.slice(end - 1, end + 1).trim() === '@') {
      this.insertMentionAt = end;
      this.setState({
        showMentionables: true,
      });
    }
  };

  insertMention = (mentionable: Mentionable) => {
    const splitter = new GraphemeSplitter();

    const mentionableLength = splitter.countGraphemes(mentionable.text);
    this.setState((oldState) => {
      const value =
        oldState.value.slice(0, this.insertMentionAt) + mentionable.text + oldState.value.slice(this.insertMentionAt);
      return {
        value,
        mentionRanges: [
          ...oldState.mentionRanges,
          {
            offset: splitter.countGraphemes(oldState.value.slice(0, this.insertMentionAt - 1)),
            length: mentionableLength + 1,
            id: mentionable.id,
            key: shortid.generate(),
          },
        ],
        showMentionables: false,
      };
    });
  };

  render() {
    const { mentionables, ...rest } = this.props;
    const { value, mentionRanges, showMentionables } = this.state;

    const sortedMentionRanges = mentionRanges.sort((a, b) => a.offset - b.offset);

    const splitter = new GraphemeSplitter();

    const characters = splitter.splitGraphemes(value).map((character, index) => {
      const mentionRange = sortedMentionRanges.find((sortedMentionRange) => {
        const { offset, length } = sortedMentionRange;
        return offset <= index && offset + length > index;
      });

      const key = mentionRange ? mentionRange.key : null;

      return {
        text: character,
        key,
      };
    });

    const items = [];
    let currentText = '';
    let currentKey: string | null = null;

    characters.forEach((character) => {
      const { text, key } = character;
      if (currentText === null && currentKey === null) {
        currentText = text;
        currentKey = key || null;
      } else if (currentKey === key || currentText === '') {
        currentText += text;
        currentKey = key;
      } else {
        items.push({
          text: currentText,
          isMention: currentKey != null,
          key: currentKey || shortid.generate(),
        });
        currentText = text;
        currentKey = key || null;
      }
    });

    if (currentText.length > 0) {
      items.push({
        text: currentText,
        isMention: currentKey != null,
        key: currentKey || shortid.generate(),
      });
    }

    return (
      <>
        <TextInput {...rest} onChangeText={this.onChangeText} onSelectionChange={this.onSelectionChange}>
          {items.map((item) => {
            const { text, isMention, key } = item;
            if (isMention) {
              return (
                <Text key={key} style={styles.mention}>
                  {text}
                </Text>
              );
            }
            return <Text key={key}>{text}</Text>;
          })}
        </TextInput>
        {showMentionables ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            horizontal
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 56,
            }}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {mentionables.map((mentionable) => (
              <TouchableOpacity
                key={mentionable.id}
                style={{}}
                onPress={() => {
                  this.insertMention(mentionable);
                }}
              >
                <Text>{mentionable.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}
      </>
    );
  }
}

export default MentionsTextInput;
