import React, { Component } from 'react';
import { Modal, Form, Input, Select, message, IconSelect } from 'choerodon-ui';
import { Content, stores, axios } from 'choerodon-front-boot';
import { injectIntl, FormattedMessage } from 'react-intl';
import './OperateSpace.scss';


const { Sidebar } = Modal;
const { TextArea } = Input;
const { Option } = Select;
const { AppState } = stores;
const FormItem = Form.Item;
const intlPrefix = 'global.menusetting';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const inputWidth = 512;

class AddSpace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originUsers: [],
      selectLoading: false,
      createLoading: false,
    };
  }

  handleOk(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { icon, name, describe } = values;
        const component = {
          icon,
          name,
          describe
        };
        this.setState({ createLoading: true });
        axios.post(`/wiki/v1/organizations/167/space`, component)
          .then((res) => {
            this.setState({
              createLoading: false,
            });
            this.props.onOk();
          })
          .catch((error) => {
            this.setState({
              createLoading: false,
            });
            message.error('创建模块失败');
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Sidebar
        className="c7n-component-component"
        title="创建空间"
        okText="创建"
        cancelText="取消"
        visible={this.props.visible || false}
        confirmLoading={this.state.createLoading}
        onOk={this.handleOk.bind(this)}
        onCancel={this.props.onCancel.bind(this)}
      >
        <Content
          style={{
            padding: 0,
            width: 512,
          }}
          title={`在项目"${AppState.currentMenuType.name}"中创建空间`}
          description="为你的项目或组织创建一个空间。"
        >
          <Form>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('icon', {
                rules: [{
                  required: true,
                  message: '空间图标必须'
                }],
                validateTrigger: 'onChange'
              })(
                <IconSelect
                  label={<FormattedMessage id={`${intlPrefix}.icon`}/>}
                  style={{ width: inputWidth }}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '空间名称必填',
                }],
              })(
                <Input label="空间名称" maxLength={30} />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('describe', {})(
                <TextArea label="空间描述" autosize maxLength={150} />,
              )}
            </FormItem>
          </Form>
        </Content>
      </Sidebar>
    );
  }
}

export default Form.create()(AddSpace);
