/**
 *  this script is used to generate the XML manifest for the OWA
 */
const fs = require('fs');
const path = require('path');
const {version} = require('../package.json');
const outPath = path.resolve(path.join(__dirname, '..', 'src', 'manifest.xml'));

const env = (() => {
  switch(process.env.ENV) {
    case 'prod':
      return {
        APP_NAME: 'OWA',
        APP_UUID : '7164e750-dc86-49c0-b548-1bac57abdc7c',
        BUILD: process.env.BUILD_COUNTER || '0',
        LOGO_BASE_NAME: 'logo',
        OWA_URL : `https://owa.com/v3`,
        WEBAPP_URL: 'https://app.com',
      };
    case 'org':
      return {
        APP_NAME: 'OWA (ORG)',
        APP_UUID: '7164e750-dc86-49c0-b548-1bac57abdc7c',
        BUILD: process.env.BUILD_COUNTER || '0',
        LOGO_BASE_NAME: 'logo-orange',
        OWA_URL : `https://test.com/v3`,
        WEBAPP_URL: 'https://app.org',
      };
    default:
      return {
        APP_NAME: 'OWA (localhost)',
        BUILD: process.env.BUILD_COUNTER || '0',
        APP_UUID: '7164e750-dc86-49c0-b548-1bac57abdc7c',
        LOGO_BASE_NAME: 'logo',
        OWA_URL : 'https://localhost:8443/v3',
        WEBAPP_URL: 'https://localhost:3001',
      };
  }
})();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp
  xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"
  xmlns:mailappor="http://schemas.microsoft.com/office/mailappversionoverrides"
  xsi:type="MailApp"
>
  <Id>${env.APP_UUID}</Id>
  <Version>${version}.${env.BUILD}</Version>
  <ProviderName>OWA B.V.</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="${env.APP_NAME}" />
  <Description DefaultValue="TEST">
    <Override Locale="nl-nl" Value="TEST" />
  </Description>
  <IconUrl DefaultValue="${env.OWA_URL}/assets/${env.LOGO_BASE_NAME}-64x64.png" />
  <HighResolutionIconUrl DefaultValue="${env.OWA_URL}/assets/${env.LOGO_BASE_NAME}-80x80.png" />

  <!--
  Domains that will be allowed when navigating.
  For example, if you use ShowTaskpane and then have an href link, navigation will only be allowed if the domain is on this list.
  -->
  <AppDomains>
    <AppDomain>${env.OWA_URL.replace('https://', '').replace('/v3','')}</AppDomain>
    <AppDomain>${env.WEBAPP_URL.replace('https://', '')}</AppDomain>
  </AppDomains>
  <Hosts>
    <Host Name="Mailbox" />
  </Hosts>
  <Requirements>
    <Sets>
      <Set Name="Mailbox" MinVersion="1.5" />
    </Sets>
  </Requirements>
  <FormSettings>
    <Form xsi:type="ItemRead">
      <DesktopSettings>
        <SourceLocation DefaultValue="${env.OWA_URL}/index.html#/entry/read"/>
        <RequestedHeight>250</RequestedHeight>
      </DesktopSettings>
      <TabletSettings>
        <SourceLocation DefaultValue="${env.OWA_URL}/index.html#/entry/read"/>
        <RequestedHeight>250</RequestedHeight>
      </TabletSettings>
      <PhoneSettings>
        <SourceLocation DefaultValue="${env.OWA_URL}/index.html#/entry/read"/>
      </PhoneSettings>
    </Form>
    <Form xsi:type="ItemEdit">
      <DesktopSettings>
        <SourceLocation DefaultValue="${env.OWA_URL}/index.html#/entry/compose"/>
      </DesktopSettings>
      <TabletSettings>
        <SourceLocation DefaultValue="${env.OWA_URL}/index.html#/entry/compose"/>
      </TabletSettings>
      <PhoneSettings>
        <SourceLocation DefaultValue="${env.OWA_URL}/index.html#/entry/compose"/>
      </PhoneSettings>
    </Form>
  </FormSettings>

  <Permissions>ReadWriteMailbox</Permissions>
  <Rule xsi:type="RuleCollection" Mode="Or">
    <Rule xsi:type="ItemIs" ItemType="Message" FormType="ReadOrEdit" />
  </Rule>

  <DisableEntityHighlighting>false</DisableEntityHighlighting>

  <VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides" xsi:type="VersionOverridesV1_0">
    <!-- On Send requires VersionOverridesV1_1 -->
    <VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides/1.1" xsi:type="VersionOverridesV1_1">
      <Requirements>
        <bt:Sets DefaultMinVersion="1.5">
          <bt:Set Name="Mailbox" />
        </bt:Sets>
      </Requirements>
      <Hosts>
        <Host xsi:type="MailHost">
          <DesktopFormFactor>
            <!-- Location of the Functions that UI-less buttons can trigger (ExecuteFunction Actions). -->
            <FunctionFile resid="functionFile" />
            <ExtensionPoint xsi:type="Events">
              <Event Type="ItemSend" FunctionExecution="synchronous" FunctionName="onItemSend" />
            </ExtensionPoint>

            <!-- Message Compose -->
            <ExtensionPoint xsi:type="MessageComposeCommandSurface">
              <OfficeTab id="TabDefault">
                <Group id="msgComposeGroup">
                  <Label resid="groupLabel" />
                  <Control xsi:type="Button" id="msgComposeOpenPaneButton">
                    <Label resid="paneComposeButtonLabel" />
                    <Supertip>
                      <Title resid="paneComposeSuperTipTitle" />
                      <Description resid="paneComposeSuperTipDescription" />
                    </Supertip>
                    <Icon>
                      <bt:Image size="16" resid="icon16" />
                      <bt:Image size="32" resid="icon32" />
                      <bt:Image size="80" resid="icon80" />
                    </Icon>
                    <Action xsi:type="ShowTaskpane">
                      <SourceLocation resid="messageComposePaneUrl"/>
                      <SupportsPinning>true</SupportsPinning>
                    </Action>
                  </Control>
                </Group>
              </OfficeTab>
            </ExtensionPoint>

            <!-- Message Read -->
            <ExtensionPoint xsi:type="MessageReadCommandSurface">
              <OfficeTab id="TabDefault">
                <Group id="msgReadGroup">
                  <Label resid="groupLabel" />
                  <!-- Launch the add-in : task pane button -->
                  <Control xsi:type="Button" id="msgReadOpenPaneButton">
                    <Label resid="paneReadButtonLabel" />
                    <Supertip>
                      <Title resid="paneReadSuperTipTitle" />
                      <Description resid="paneReadSuperTipDescription" />
                    </Supertip>
                    <Icon>
                      <bt:Image size="16" resid="icon16" />
                      <bt:Image size="32" resid="icon32" />
                      <bt:Image size="80" resid="icon80" />
                    </Icon>
                    <Action xsi:type="ShowTaskpane">
                      <SourceLocation resid="messageReadPaneUrl" />
                      <SupportsPinning>true</SupportsPinning>
                    </Action>
                  </Control>
                  <!-- Go to http://aka.ms/ButtonCommands to learn how to add more Controls: ExecuteFunction and Menu -->
                </Group>
              </OfficeTab>
            </ExtensionPoint>
          </DesktopFormFactor>
        </Host>
      </Hosts>

      <Resources>
        <bt:Images>
          <bt:Image id="icon16" DefaultValue="${env.OWA_URL}/assets/${env.LOGO_BASE_NAME}-16x16.png"/>
          <bt:Image id="icon32" DefaultValue="${env.OWA_URL}/assets/${env.LOGO_BASE_NAME}-32x32.png"/>
          <bt:Image id="icon80" DefaultValue="${env.OWA_URL}/assets/${env.LOGO_BASE_NAME}-80x80.png"/>
        </bt:Images>
        <bt:Urls>
          <bt:Url id="functionFile" DefaultValue="${env.OWA_URL}/index.html#/entry/on-send"/>
          <bt:Url id="messageComposePaneUrl" DefaultValue="${env.OWA_URL}/index.html#/entry/compose"/>
          <bt:Url id="messageReadPaneUrl" DefaultValue="${env.OWA_URL}/index.html#/entry/read"/>
        </bt:Urls>
        <bt:ShortStrings>
          <bt:String id="groupLabel" DefaultValue="OWA Group"/>
          <bt:String id="customTabLabel"  DefaultValue="OWA Tab"/>
          <!-- compose -->
          <bt:String id="paneComposeButtonLabel" DefaultValue="Send with OWA">
            <bt:Override Locale="nl-nl" Value="OWA" />
          </bt:String>
          <bt:String id="paneComposeSuperTipTitle" DefaultValue="Send OWA">
            <bt:Override Locale="nl-nl" Value="OWA" />
          </bt:String>
          <bt:String id="msgComposeOpenPaneButton" DefaultValue="Send OWA">
            <bt:Override Locale="nl-nl" Value="OWA" />
          </bt:String>
          <!-- read -->
          <bt:String id="paneReadButtonLabel" DefaultValue="Read OWA">
            <bt:Override Locale="nl-nl" Value="OWA" />
          </bt:String>
          <bt:String id="paneReadSuperTipTitle" DefaultValue="Read OWA">
            <bt:Override Locale="nl-nl" Value="OWA" />
          </bt:String>
          <bt:String id="msgReadOpenPaneButton" DefaultValue="Read OWA">
            <bt:Override Locale="nl-nl" Value="OWA" />
          </bt:String>
        </bt:ShortStrings>
        <bt:LongStrings>
          <bt:String id="paneComposeSuperTipDescription" DefaultValue="paneComposeSuperTipDescription"/>
          <bt:String id="paneReadSuperTipDescription" DefaultValue="paneReadSuperTipDescription"/>
        </bt:LongStrings>
      </Resources>
    </VersionOverrides>
  </VersionOverrides>

</OfficeApp>
`;

fs.writeFileSync(outPath, xml, { encoding: 'UTF-8'});
