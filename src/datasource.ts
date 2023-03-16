import { IntegrationBase } from "@budibase/types"
import { Client, Attribute, Change } from 'ldapts';

interface Query {
  method: string
  body?: string
  headers?: { [key: string]: string }
}

class CustomIntegration implements IntegrationBase {
  private readonly host: string
  private readonly ldapPort: number
  private readonly userDN: string
  private readonly password: string
  private readonly client: Client
  private readonly tlsOptions: object

  constructor(config: { host: string; ldapPort: number; userDN: string; password: string }) {
    this.host = config.host
    this.ldapPort = config.ldapPort
    this.userDN = config.userDN
    this.password = config.password
    this.tlsOptions = {}

    if (this.host.startsWith("ldaps://")) {
      this.tlsOptions = {
        minVersion: 'TLSv1.2',
      }
    }

    this.client = new Client({
      url: this.host + ":" + this.ldapPort,
      timeout: 0,
      connectTimeout: 0,
      tlsOptions: this.tlsOptions,
      strictDN: true,
    });
  }

  async create(query: { objectDN: string, attributes: string }) {
    try {
      let attr = JSON.parse(query.attributes);
      await this.client.bind(this.userDN, this.password);
      return await this.client.add(query.objectDN, attr);
    } catch (err) {
      throw err;
    } finally {
      await this.client.unbind();
    }
  }

  async read(query: { searchDN: string, options: string }) {
    try {
      let opt = JSON.parse(query.options);
      await this.client.bind(this.userDN, this.password);
      let results = await this.client.search(query.searchDN, opt);
      return results.searchEntries;
    } catch (err) {
      throw err;
    } finally {
      await this.client.unbind();
    }
  }

  async update(query: { objectDN: string, attributes: string }) {
    try {
      await this.client.bind(this.userDN, this.password);

      let attr = JSON.parse(query.attributes);
      let mods = [];

      attr.forEach((value, key) => {
        mods.push(new Change({
          operation: 'replace', modification: new Attribute(
              { type: key, values: [value] }
          )
        }));
      })

      return await this.client.modify(query.objectDN, attr);
    } catch (err) {
      throw err;
    } finally {
      await this.client.unbind();
    }
  }

  async delete(query: { objDN: string }) {
    try {
      await this.client.bind(this.userDN, this.password);
      return await this.client.del(query.objDN);
    } catch (err) {
      throw err;
    } finally {
      await this.client.unbind();
    }
  }
}

export default CustomIntegration
