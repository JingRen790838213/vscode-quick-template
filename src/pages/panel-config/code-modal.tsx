/* eslint-disable @typescript-eslint/naming-convention */
import { Input, Modal } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

interface CodeModalProps {
  onSaveCallback: (record: any) => any;
}
const CodeModal = forwardRef((props: CodeModalProps, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, any>>({});
  const [content, setContent] = useState<string>();

  const toggle = useCallback(
    (record?: Record<string, any>) => {
      if (!visible && record) {
        setCurrentRecord(record);
        setContent(record.content);
      }
      setVisible((v) => !v);
    },
    [visible],
  );

  const onOk = () => {
    currentRecord.content = content;
    props.onSaveCallback(currentRecord);
    toggle();
  };

  useImperativeHandle(ref, () => ({
    toggle,
  }));

  return (
    <Modal
      title="模版内容"
      visible={visible}
      okText="保存"
      cancelText="取消"
      onOk={onOk}
      width={600}
      onCancel={toggle}
    >
      <pre className="language-tsx">
        <Input.TextArea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          style={{ height: '400px', overflow: 'scroll' }}
        />
      </pre>
      <div>
        如果文件内包含<b>REPLACE_STRING</b>，将被替换成文件夹名称.
        <br />如 <b>test-mange</b> 转换成 <b>TestMange</b>
      </div>
    </Modal>
  );
});

export default CodeModal;
