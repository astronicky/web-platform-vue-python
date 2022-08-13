import http from '@/common/http';
import API from '@/API';

const Masterfile = {
  /**
   * Fetches masterfile given the month, year, and integration_id
   */
  async downloadMasterfile(integrationId: string): Promise<string[]> {
    try {
        const response = await http.get('/globe/masterfile/untagged',
        {
            params: {
                integration_id: integrationId,
            },
        });

        return [response.data];

    } catch (error) {
        // this.showErrorNotification(error);
        return [''];
    }
  },
  async getTaggedMasterfile(integrationId: string): Promise<string[]> {
    try {
        const response = await http.get('/globe/masterfile/tagged',
        {
            params: {
                integration_id: integrationId,
            },
        });

        return [response.data];

    } catch (error) {
        return [''];
    }
  },
  async getPresignedURL(content_md5: string, year: number, month: number, integrationId: string, organizationId: string, filename: string): Promise<string[]> {
    try {
        const presignedURL = await http.put('/globe/masterfile/tagged',
        {
          content_md5,
          year,
          month,
          integration_id: integrationId,
          organization_id: organizationId,
          filename,
        });

        return presignedURL.data.url;

    } catch (error) {
        // this.showErrorNotification(error);
        return [''];
    }
  },
  async uploadMasterfile(presignedURL: string, content_md5: string, file: any, file_type: string): Promise<any> {

    API.UI.addNotification({
      type: 'primary',
      text: 'Uploading your Tagged Master File. Please wait...',
    });

    try {
        // Directly using http.put did not seem to work.
        const upload = await fetch(presignedURL, {
          method: 'PUT',
          headers: {
            'Content-MD5': content_md5,
            'Content-Type': file_type,
          },
          body: file,
        });

        API.UI.addNotification({
            type: 'primary',
            text: 'Tagged Master File uploaded successfully.',
          });

        return upload.text();

    } catch (error) {
        return [''];
    }
  },
};

export default Masterfile;
