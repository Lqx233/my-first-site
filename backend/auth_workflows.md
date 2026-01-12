# Auth Workflows

## Login / Register Decision Tree

```mermaid
flowchart TD
  A[UI: 用户点击登录] --> P{用户是否勾选隐私协议?}
  P -->|否| P1[提示: 请先阅读并同意协议]
  P -->|是| B{SDK环境检测: 蜂窝网络?}

  %% 网关认证分支
  B -->|是| C[SDK: 唤起运营商授权页]
  C --> U{用户点击本机号码登录?}
  U -->|否/关闭| H
  U -->|是| D[SDK: 获取临时 Token]
  D --> API1[API: 后端置换真实手机号]
  API1 -->|置换成功| F[DB: 查找或创建 Users账户]
  API1 -->|失败/超时| H[UI: 自动降级为短信登录]

  %% 短信验证分支
  B -->|否/WiFi| H
  H --> K1[UI: 输入手机号 + 滑动验证]
  K1 --> K2{滑动验证通过?}
  K2 -->|否| K1
  K2 -->|是| I[API: 请求发送短信验证码]
  I --> J[UI: 用户输入验证码]
  J --> K{API: 校验验证码?}
  K -->|否| J
  K -->|是| F

  %% 收尾
  F --> G[生成 JWT Access/Refresh Token]
  G --> Z[登录成功]
```

## Dual App Role Check

```mermaid
flowchart TD
  A[登录成功: 获得 UserID] --> B[DB: 查询用户现有 Roles]
  B --> D{当前 App 端?}

  %% 用户端逻辑 (C端)
  D -->|用户端 App| E{包含 ROLE_CLIENT?}
  E -->|是| G[放行: 生成用户端 Token]
  E -->|否 (新用户)| E1[Action: 自动赋予 ROLE_CLIENT]
  E1 --> G

  %% 商家端逻辑 (B端)
  D -->|商家端 App| F{包含 ROLE_MERCHANT?}
  F -->|是| I{商家资料审核状态?}

  I -->|已通过| J[放行: 生成商家端 Token]
  I -->|审核中| K[UI: 提示正在审核中]
  I -->|被拒绝| L[UI: 提示拒绝原因 & 重新提交]

  %% 商家端无权限处理
  F -->|否| M[UI: 跳转商家入驻申请页]
  M --> N[填写资料 & 提交审核]
```
